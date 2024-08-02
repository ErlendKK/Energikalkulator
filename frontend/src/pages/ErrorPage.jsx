import "../index.css";

// Copied from https://reactrouter.com/en/main/start/tutorial#handling-not-found-errors
function ErrorPage() {
  return (
    <div id="error-page">
      <div className="container error-container ">
        <div className="card error-card">
          <div className="card-header card-form-header">
            <h3 className="card-form-heading">Oops!</h3>
          </div>
          <div className="card-body error-card-body">
            <p>En uforventet feil har oppstått.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ErrorPage;
