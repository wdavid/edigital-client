import ProtectedRoute from "../../components/ProtectedRoute";

export default function ProtectedPage() {
  return (
    <ProtectedRoute>
      <h1>Esta es una página protegida</h1>
    </ProtectedRoute>
  );
}
