"use client";
import {useState } from 'react';
import axios from 'axios';
import { baseUrl } from '@/api/ports';
import { useStore, } from '@/context/StoreContext';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const StoreClosureDisplay = () => {
  const { setStoreClosureId, storeClosures } = useStore();
  
  const [isVisible, setIsVisible] = useState(false);
  
  const { data: session } = useSession();
  const router = useRouter();

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const handleCreateStoreClosure = () => {
    router.push('/superuser'); 
  };

  const handleUpdateStoreClosure = (closureId) => {
    setStoreClosureId(closureId);
    router.push('/superuser'); 
  };

  const handleDeleteStoreClosure = async (closureId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this store closure? This action cannot be undone.");
    if (confirmDelete) {
      try {
        await axios.delete(`${baseUrl}/api/storeclosures/${closureId}`, {
          headers: {
            'Authorization': `Bearer ${session.accessToken}`,
          },
        });
        setStoreClosures(storeClosures.filter(closure => closure._id !== closureId));
        alert('Store closure successfully deleted');
      } catch (error) {
        console.error('Failed to delete store closure:', error);
        alert('Failed to delete store closure');
      }
    }
  };

  const isOwner = session?.user?.role === 'owner';

  return (
    <div className="p-4 bg-black rounded-lg shadow text-white">
      <h2 onClick={toggleVisibility} className="text-lg font-bold mb-2 cursor-pointer">Store Closures:</h2>
      
      {isVisible && (
        <>
          {isOwner && (
            <button onClick={handleCreateStoreClosure} className="px-2 py-1 mb-2 bg-green-500 hover:bg-green-700 text-white font-bold rounded">
              Create
            </button>
          )}
          <ul className="list-disc pl-5">
            {storeClosures.length > 0 ? (
              storeClosures.map((closure, index) => (
                <li key={index} className="mb-1 text-white flex justify-between items-center">
                  <span>
                      {new Date(closure.closureDate).toLocaleDateString('en-GB', {
                       day: '2-digit', month: '2-digit', year: 'numeric'
                        })}: {closure.reason}
                  </span>

                  {isOwner && (
                    <div>
                      <button onClick={() => handleUpdateStoreClosure(closure._id)} className="px-2 py-1 mr-2 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded">
                        Update
                      </button>
                      <button onClick={() => handleDeleteStoreClosure(closure._id)} className="px-2 py-1 bg-red-500 hover:bg-red-700 text-white font-bold rounded">
                        Delete
                      </button>
                    </div>
                  )}
                </li>
              ))
            ) : (
              <p>No store closures available.</p>
            )}
          </ul>
        </>
      )}
    </div>
  );
};

export default StoreClosureDisplay;
