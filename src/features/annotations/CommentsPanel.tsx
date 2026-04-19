import { LoadingState } from '../../components/LoadingState';
import { Comment } from '../../types/annotations';

interface CommentsPanelProps {
  comments: Comment[];
  isLoading: boolean;
}

export function CommentsPanel({ comments, isLoading }: CommentsPanelProps) {
  if (isLoading) {
    return <LoadingState title="Loading comments" message="Fetching page-scoped collaboration metadata separately from the document binary." />;
  }

  return (
    <div className="card workspace-panel">
      <h3 className="section-title">Comments Panel</h3>
      <p className="section-copy">Placeholder surface for threaded page-level comments and audit-aware collaboration.</p>
      <ul className="list">
        {comments.map((comment) => (
          <li className="list-item" key={comment.id}>
            <strong>Page {comment.pageNumber}</strong>
            <div>{comment.text}</div>
            <small>{comment.createdBy}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}
