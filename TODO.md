# Feature Ideas

- **Document ingestion & retrieval**
  - Wire `DocumentsPanel` to Supabase Storage/S3 for uploads, track ingestion status, and feed stored docs into RAG for chat.
- **Persisted settings & provider management**
  - Add Supabase `user_settings`, save API keys/preferences, validate keys, and gate advanced capabilities based on configuration.
- **Report collaboration workflow**
  - Layer inline annotations, sharing links, approval states, and external export options (Notion/Slack) on top of `ReportViewer`.
- **Portfolio & analytics view**
  - Create a Portfolio tab summarizing saved reports with filters, sector/risk charts, and metadata trends.
- **Scheduled reruns & alerts**
  - Enable scheduled diligence jobs per ticker, surface job history, and notify users (email/Slack) when reports/red flags land.
- **Advanced chat workflows**
  - Support message attachments, slash commands, inline citations, pinned answers, and chat metadata like rename/star/merge.
