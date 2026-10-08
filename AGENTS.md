<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Project architecture

- Keep BookkeepingHub as a single-page, frontend-state experience until persistent booking and integrations are explicitly requested, so the current flow remains demonstrable without backend dependencies.
- Keep the accounts receivable opening in a focused section component with booking delegated to the parent page, so every call action shares the existing intake state.
