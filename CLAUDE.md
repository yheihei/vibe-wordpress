# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 応答のルール
- 常に日本語で応答してください。コード部分はそのままにしてください。

## **MUST** 思考のルール
- 思考する際は英語で考えてください

## **MUST** PLAY NOTIFY SOUND AFTER EVERY CHAT

MANDATORY: ALWAYS ALERT
Use command `say "できたぜぇ！？"` to notify the user.

### GitHubにアクセスしたい時

`gh` コマンドを使うこと

## タスクの遂行方法

適用条件: 実装を依頼された時。単なる質問事項の場合適用されない。

### 基本フロー

- PRD の各項目を「Plan → Imp → Debug → Review → Doc」サイクルで処理する  
- irreversible / high-risk 操作（削除・本番 DB 変更・外部 API 決定）は必ず停止する

#### Phase1 Plan

- PRDを受け取ったら、PRDを確認し、不明点がないか確認する
- その後、PRD の各項目を Planに落とし込む
  - Planは `.docs/todo/YYYYMMDDhhmm_${タスクの概要}.md` に保存
- ユーザーにPlanの確認を行い、承認されるまで次のフェーズには移行しない

#### Phase2 Imp

- Planをもとに実装する

#### Phase3 Debug

- 指定のテストがあればテストを行う
- 指定がなければ関連のテストを探してテストを行う
- 関連のテストがなければ停止して、なんのテストを行うべきかユーザーに確認する
- テストが通ったらフォーマッタをかける
- lintチェックを行い、エラーがあればImpに戻り、修正する

#### Phase4 Review

- これまでのやり取りの中でPRDの変更があったら。最新のPRDに更新する
- subagentを起動し、PRDを伝え、レビューしてもらう
- レビュー指摘があればImpに戻る

#### Phase5 Doc

- 基本設計書を`.docs/design/YYYYMMDD_${タスクの概要}.md` に保存
- ユーザーからのフィードバックを待つ。フィードバックがあれば適宜前のフェーズに戻ること
