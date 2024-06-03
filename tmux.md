Prefix key: `Ctrl-b`

## Sessions (Main Thing that holds everything)

- `tmux` - start new
- `tmux new -s myname` - start with session name
- `tmux a` - (or `at`, `attach`) attach to
- `tmux a -t myname` - attach to named
- `tmux ls` - list Sessions
- `tmux kill-session -t myname` - kill session

## Windows (tabs)

- `Ctrl-b c` - create window
- `Ctrl-b w` - list windows
- `Ctrl-b n` - next window
- `Ctrl-b p` - previous window
- `Ctrl-b f` - find window
- `Ctrl-b ,` - name window

## Panes (splits)

- `Ctrl-b %` - vertical split
- `Ctrl-b "` - horizontal splits
- `Ctrl-b o` - swap Panes
- `Ctrl-b q` - show pane numbers
- `Ctrl-b x` - kill Panes
- `Ctrl-b +` - break pane into window (e.g. to select text by mouse to copy)
- `Ctrl-b z` - zoom pane (maximize/restore)

## Misc

- `Ctrl-b d` - detach from Sessions
- `Ctrl-b ?` - list shortcuts
- `Ctrl-b :` - prompt (e.g. to kill Sessions: `kill-session -t myname`)


