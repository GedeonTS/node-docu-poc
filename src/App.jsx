import { useState } from 'react';
import { SigningView, DottedBackground } from '@documenso/embed-react';

// Get the Documenso URL from Vite environment variables
const DOCUMENSO_URL = import.meta.env.VITE_DOCUMENSO_URL;

export default function App() {
  const [signingToken, setSigningToken] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(event.target);

    try {
      const response = await fetch('http://localhost:3001/api/create-document', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details?.message || errorData.error || 'Failed to create document.');
      }

      const { token } = await response.json();
      setSigningToken(token);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (signingToken) {
    return (
      <div className="w-screen h-screen">
        <SigningView
          token={signingToken}
          url={DOCUMENSO_URL}
          onSigned={() => alert('Document has been successfully signed!')}
        />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-gray-50 overflow-hidden">
      <DottedBackground className="absolute inset-0" />
      <div className="relative max-w-2xl w-full bg-white shadow-2xl rounded-2xl p-8 md:p-12 z-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Documenso API Integration PoC</h1>
          <p className="text-gray-500 mt-2">Upload a document and specify two signers to begin.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="document-upload" className="block text-sm font-medium text-gray-700 mb-1">
              Document (PDF)
            </label>
            <input
              id="document-upload"
              name="document"
              type="file"
              accept=".pdf"
              required
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-colors duration-200"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4 p-4 border rounded-lg">
                <h3 className="font-semibold text-gray-700">Signer 1</h3>
                 <div>
                    <label htmlFor="signer1Name" className="block text-sm font-medium text-gray-700">Name</label>
                    <input type="text" name="signer1Name" id="signer1Name" defaultValue="John Doe" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"/>
                </div>
                 <div>
                    <label htmlFor="signer1Email" className="block text-sm font-medium text-gray-700">Email</label>
                    <input type="email" name="signer1Email" id="signer1Email" defaultValue="john.doe@example.com" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"/>
                </div>
            </div>

            <div className="space-y-4 p-4 border rounded-lg">
                 <h3 className="font-semibold text-gray-700">Signer 2</h3>
                 <div>
                    <label htmlFor="signer2Name" className="block text-sm font-medium text-gray-700">Name</label>
                    <input type="text" name="signer2Name" id="signer2Name" defaultValue="Jane Smith" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"/>
                </div>
                 <div>
                    <label htmlFor="signer2Email" className="block text-sm font-medium text-gray-700">Email</label>
                    <input type="email" name="signer2Email" id="signer2Email" defaultValue="jane.smith@example.com" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"/>
                </div>
            </div>
          </div>
          
          <div>
            <button 
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : 'Create & Sign Document'}
            </button>
          </div>
        </form>

        {error && (
          <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
            <p className="font-bold">An error occurred:</p>
            <p className="text-sm">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}
