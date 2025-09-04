import React, { useState } from 'react';
import { EmbedSignDocument } from "@documenso/embed-react";

// The base URL of your Documenso instance is now read from a Vite environment variable
// Make sure to create a .env file in your project root with this variable.
const DOCUMENSO_URL = import.meta.env.VITE_DOCUMENSO_URL;

// --- Style Objects ---
const styles = {
  // Main App Container
  appContainer: {
    minHeight: '100vh',
    backgroundColor: '#F9FAFB', // bg-gray-50
    color: '#1F2937', // text-gray-800
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem', // p-4
  },
  contentWrapper: {
    width: '100%',
    maxWidth: '32rem', // max-w-lg
  },
  formContainer: {
    backgroundColor: 'white',
    padding: '2rem', // p-8
    borderRadius: '0.75rem', // rounded-xl
    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)', // shadow-md
  },
  h1: {
    fontSize: '1.5rem', // text-2xl
    fontWeight: '700', // font-bold
    textAlign: 'center',
    marginBottom: '1.5rem', // mb-6
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem', // space-y-4
  },
  // Form Elements
  label: {
    display: 'block',
    fontSize: '0.875rem', // text-sm
    fontWeight: '500', // font-medium
    color: '#374151', // text-gray-700
  },
  input: {
    marginTop: '0.25rem', // mt-1
    display: 'block',
    width: '100%',
    padding: '0.5rem 0.75rem',
    backgroundColor: 'white',
    border: '1px solid #D1D5DB', // border-gray-300
    borderRadius: '0.375rem', // rounded-md
    boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)', // shadow-sm
  },
  fileInput: {
     marginTop: '0.25rem',
     display: 'block',
     width: '100%',
     fontSize: '0.875rem',
     color: '#6B7280',
  },
  fieldset: {
    borderTop: '1px solid #E5E7EB', // border-t
    paddingTop: '1rem', // pt-4
    borderWidth: '0',
  },
  legend: {
    fontSize: '0.875rem',
    fontWeight: '600', // font-semibold
    color: '#111827', // text-gray-900
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(1, minmax(0, 1fr))',
    gap: '1rem',
    marginTop: '0.5rem',
  },
  // Buttons
  button: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    padding: '0.5rem 1rem',
    border: '1px solid transparent',
    borderRadius: '0.375rem',
    boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    fontSize: '0.875rem',
    fontWeight: '500',
    color: 'white',
    backgroundColor: '#4F46E5', // bg-indigo-600
    cursor: 'pointer',
  },
  buttonDisabled: {
    backgroundColor: '#A5B4FC', // disabled:bg-indigo-300
    cursor: 'not-allowed',
  },
  resetButton: {
    marginTop: '1.5rem',
    backgroundColor: '#4B5563', // bg-gray-600
  },
  // Status Messages
  errorText: {
    marginTop: '1rem',
    textAlign: 'center',
    fontSize: '0.875rem',
    color: '#DC2626', // text-red-600
    fontWeight: '500',
  },
  successContainer: {
    textAlign: 'center',
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '0.75rem',
    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  },
  successText: {
    fontSize: '1.125rem', // text-lg
    fontWeight: '500',
    color: '#16A34A', // text-green-600
  },
  signedConfirmation: {
     marginTop: '1rem',
     padding: '0.75rem',
     backgroundColor: '#D1FAE5', // bg-green-100
     color: '#065F46', // text-green-800
     borderRadius: '0.5rem',
     fontSize: '0.875rem',
     fontWeight: '600',
  },
  // Embed Container
  embedContainer: {
    width: '100%',
    maxWidth: '80rem', // max-w-5xl
    height: '80vh',
    marginTop: '2rem',
    borderRadius: '0.5rem',
    boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.25)', // shadow-2xl
    overflow: 'hidden',
    border: '1px solid #E5E7EB', // border-gray-200
  },
  // Config Error Screen
  configErrorContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#FEF2F2', // bg-red-50
    color: '#1F2937',
  },
  configErrorBox: {
    padding: '2rem',
    backgroundColor: 'white',
    borderRadius: '0.5rem',
    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    textAlign: 'center',
    maxWidth: '32rem',
  },
  configErrorH1: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#B91C1C', // text-red-700
  },
  configErrorCode: {
    display: 'block',
    backgroundColor: '#F3F4F6',
    padding: '0.5rem',
    marginTop: '0.5rem',
    borderRadius: '0.25rem',
    textAlign: 'left',
    fontSize: '0.875rem',
  }
};


// A simple component to show a configuration error if the .env variable is missing.
function ConfigurationError() {
  return (
    <div style={styles.configErrorContainer}>
      <div style={styles.configErrorBox}>
        <h1 style={styles.configErrorH1}>Configuration Error</h1>
        <p style={{ marginTop: '0.5rem', color: '#DC2626' }}>The <code>VITE_DOCUMENSO_URL</code> environment variable is missing.</p>
        <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: '#4B5563' }}>
          Please create a file named <code>.env</code> in the project root folder and add the following line, replacing the URL with your actual Documenso instance URL:
        </p>
        <code style={styles.configErrorCode}>
          VITE_DOCUMENSO_URL=http://localhost:3000
        </code>
         <p style={{ marginTop: '1rem', fontSize: '0.75rem', color: '#6B7280' }}>
          After adding the <code>.env</code> file, you must restart the development server for the change to take effect.
        </p>
      </div>
    </div>
  );
}

export default function App() {
  const [signingToken, setSigningToken] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSigned, setIsSigned] = useState(false);

  // Early return if the environment variable is not set. This is a common setup issue.
  if (!DOCUMENSO_URL) {
    return <ConfigurationError />;
  }

  const handleReset = () => {
    setSigningToken(null);
    setError(null);
    setIsSigned(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setIsSigned(false);

    const formData = new FormData(event.target);

    try {
      // Ensure the server URL is correct for your setup
      const response = await fetch('http://localhost:3001/api/create-document', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'An unknown server error occurred.' }));
        throw new Error(errorData.details?.message || errorData.error || `Request failed with status ${response.status}`);
      }

      const { token } = await response.json();

      // Set the signing token received from the backend
      setSigningToken(token);

    } catch (err) {
      console.error('Submission Error:', err);
      // Check for a network error specifically, which is a common problem.
      if (err instanceof TypeError && err.message.includes('fetch')) {
         setError('Network Error: Could not connect to the backend server. Please ensure it is running on http://localhost:3001.');
      } else {
         setError(err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.appContainer}>
      <div style={styles.contentWrapper}>
        {!signingToken ? (
          <div style={styles.formContainer}>
            <h1 style={styles.h1}>Create & Sign Document</h1>
            <form onSubmit={handleSubmit}>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label htmlFor="document" style={styles.label}>Document (PDF)</label>
                  <input type="file" name="document" id="document" required accept=".pdf" style={styles.fileInput}/>
                </div>

                <fieldset style={styles.fieldset}>
                  <legend style={styles.legend}>Signer 1</legend>
                  <div style={{...styles.grid, '@media (min-width: 768px)': { gridTemplateColumns: 'repeat(2, minmax(0, 1fr))'}}}>
                    <div>
                      <label htmlFor="signer1-name" style={styles.label}>Name</label>
                      <input type="text" name="signer1Name" id="signer1-name" required style={styles.input} />
                    </div>
                    <div>
                      <label htmlFor="signer1-email" style={styles.label}>Email</label>
                      <input type="email" name="signer1Email" id="signer1-email" required style={styles.input} />
                    </div>
                  </div>
                </fieldset>

                <fieldset style={styles.fieldset}>
                  <legend style={styles.legend}>Signer 2</legend>
                  <div style={{...styles.grid, '@media (min-width: 768px)': { gridTemplateColumns: 'repeat(2, minmax(0, 1fr))'}}}>
                    <div>
                      <label htmlFor="signer2-name" style={styles.label}>Name</label>
                      <input type="text" name="signer2Name" id="signer2-name" required style={styles.input} />
                    </div>
                    <div>
                      <label htmlFor="signer2-email" style={styles.label}>Email</label>
                      <input type="email" name="signer2Email" id="signer2-email" required style={styles.input} />
                    </div>
                  </div>
                </fieldset>
              </div>

              <div style={{ marginTop: '1.5rem' }}>
                <button type="submit" disabled={isLoading} style={{...styles.button, ...(isLoading && styles.buttonDisabled)}}>
                  {isLoading ? 'Creating...' : 'Create Document'}
                </button>
              </div>
            </form>
            {error && <p style={styles.errorText}>{error}</p>}
          </div>
        ) : (
          <div style={styles.successContainer}>
            <p style={styles.successText}>Document Ready for Signing</p>
            <p style={{ marginTop: '0.5rem', color: '#4B5563' }}>The signing window is embedded below.</p>
             {isSigned && (
              <div style={styles.signedConfirmation}>
                Document has been successfully completed!
              </div>
            )}
             <button onClick={handleReset} style={{...styles.button, ...styles.resetButton}}>
                Create Another Document
              </button>
          </div>
        )}
      </div>

      {signingToken && (
        <div style={styles.embedContainer}>
          <EmbedSignDocument
            token={signingToken}
            host={DOCUMENSO_URL}
            onDocumentCompleted={() => setIsSigned(true)}
          />
        </div>
      )}
    </div>
  );
}

