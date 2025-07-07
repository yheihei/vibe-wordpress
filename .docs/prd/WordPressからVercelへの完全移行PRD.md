# WordPress functions.php による Vercel へのリダイレクト実装 PRD

## 1. 概要

### 目的

WordPressサイトのドメインパワーを維持しながら、Vercelサイトへ301リダイレクトでトラフィックを転送する。

### URL構造の違い

| コンテンツタイプ | WordPress URL例                  | Vercel (Next.js) URL                          |
| ---------------- | -------------------------------- | --------------------------------------------- |
| 個別投稿         | `/sample-post/` または `/?p=123` | `/posts/sample-post/`                         |
| 固定ページ       | `/about/`                        | `/about/` (特定ページ) または `/pages/about/` |
| カテゴリー       | `/category/tech/`                | `/category/tech/`                             |
| タグ             | `/tag/javascript/`               | `/tag/javascript/`                            |
| 月別アーカイブ   | `/2024/01/`                      | `/archive/2024/01/`                           |
| 検索             | `/?s=keyword`                    | `/search?q=keyword`                           |

## 2. 実装コード

```php
// functions.php に追加

/**
 * Vercelサイトへの301リダイレクト（URL構造変換対応）
 */
add_action('template_redirect', function() {
    // リダイレクト先のベースURL
    $vercel_url = 'https://example.vercel.app';

    // 緊急停止パラメータ（リダイレクトループ等の問題時に使用）
    if (isset($_GET['stop_redirect'])) {
        return;
    }

    // リダイレクトループ防止
    if (isset($_COOKIE['redirect_loop_check'])) {
        return;
    }
    setcookie('redirect_loop_check', '1', time() + 10, '/');

    // 除外するパス（管理画面、API、ログイン画面など）
    $excluded_patterns = [
        '/wp-admin',
        '/wp-login.php',
        '/wp-json',
        '/wp-cron.php',
        '/xmlrpc.php',
        '/wp-content/uploads', // メディアファイルは除外
    ];

    // 現在のリクエストURI
    $request_uri = $_SERVER['REQUEST_URI'];

    // 除外パターンのチェック
    foreach ($excluded_patterns as $pattern) {
        if (strpos($request_uri, $pattern) !== false) {
            return; // リダイレクトしない
        }
    }

    // 管理画面、Ajax、REST APIリクエストは除外
    if (is_admin() || wp_doing_ajax() || wp_doing_cron()) {
        return;
    }

    // URLパスの変換
    $vercel_path = convert_wp_url_to_vercel($request_uri);

    // リダイレクトURL構築
    $redirect_url = $vercel_url . $vercel_path;

    // 301リダイレクト実行
    wp_redirect($redirect_url, 301);
    exit;
});

/**
 * WordPress URLをVercelサイトのURL構造に変換
 */
function convert_wp_url_to_vercel($wp_url) {
    // クエリパラメータを保持
    $parsed = parse_url($wp_url);
    $path = $parsed['path'] ?? '/';
    $query = isset($parsed['query']) ? '?' . $parsed['query'] : '';

    // トップページ
    if (is_home() || is_front_page()) {
        return '/' . $query;
    }

    // 個別投稿ページ
    if (is_single()) {
        $post = get_post();
        if ($post) {
            return '/posts/' . $post->post_name . $query;
        }
    }

    // 固定ページ
    if (is_page()) {
        $page = get_post();
        if ($page) {
            // aboutページなど特定のページは直接ルートに
            $root_pages = ['about', 'contact', 'privacy-policy'];
            if (in_array($page->post_name, $root_pages)) {
                return '/' . $page->post_name . $query;
            }
            // その他の固定ページ
            return '/pages/' . $page->post_name . $query;
        }
    }

    // カテゴリーアーカイブ
    if (is_category()) {
        $category = get_queried_object();
        if ($category) {
            return '/category/' . $category->slug . $query;
        }
    }

    // タグアーカイブ
    if (is_tag()) {
        $tag = get_queried_object();
        if ($tag) {
            return '/tag/' . $tag->slug . $query;
        }
    }

    // 日付アーカイブ
    if (is_date()) {
        $year = get_query_var('year');
        $month = get_query_var('monthnum');
        if ($year && $month) {
            return '/archive/' . $year . '/' . str_pad($month, 2, '0', STR_PAD_LEFT) . $query;
        }
    }

    // 検索結果
    if (is_search()) {
        $search_query = get_search_query();
        return '/search?q=' . urlencode($search_query);
    }

    // その他のURLはそのまま返す
    return $wp_url;
}
```

## 3. テスト方法

```bash
# リダイレクトの確認
curl -I https://example.com/about/

# 期待される出力
HTTP/1.1 301 Moved Permanently
Location: https://example.vercel.app/about/
```

### 主なリダイレクト例

```
# 個別投稿
https://example.com/sample-post/ → https://example.vercel.app/posts/sample-post/

# カテゴリー
https://example.com/category/tech/ → https://example.vercel.app/category/tech/

# 緊急停止（リダイレクトされない）
https://example.com/?stop_redirect=1
https://example.com/wp-login.php?stop_redirect=1
```
