import { collection, doc, setDoc, getDoc, getDocFromServer, getDocs, updateDoc, deleteDoc, query, where, orderBy, onSnapshot, serverTimestamp, addDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { Flight, Passenger, Booking } from '../types';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: any;
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Removed testConnection from here since it's in firebase.ts

export const createFirebaseBooking = async (flight: Flight, passenger: Passenger, totalAmount: number): Promise<Booking> => {
  if (!auth.currentUser) throw new Error("Must be logged in to book.");
  
  const bookingId = `BK-${Math.random().toString(36).substring(2, 11).toUpperCase()}`;
  const pnr = Math.random().toString(36).substring(2, 8).toUpperCase();
  const path = `bookings/${bookingId}`;
  
  const bookingData = {
    userId: auth.currentUser.uid,
    flightId: flight.id,
    flight,
    passenger,
    status: 'PENDING',
    pnr,
    totalAmount,
    createdAt: serverTimestamp(),
  };

  try {
    await setDoc(doc(db, 'bookings', bookingId), bookingData);
    return { ...bookingData, id: bookingId, bookingDate: new Date().toISOString() } as unknown as Booking;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
    throw error;
  }
};

export const getFirebaseBookings = async (): Promise<Booking[]> => {
  if (!auth.currentUser) return [];
  const path = 'bookings';
  try {
    let q = query(collection(db, path));
    try {
      const snap = await getDocs(q);
      return snap.docs.map(d => ({ ...d.data(), id: d.id } as Booking));
    } catch (e: any) {
      if (e?.code === 'permission-denied') {
        q = query(collection(db, path), where('userId', '==', auth.currentUser.uid));
        const snap = await getDocs(q);
        return snap.docs.map(d => ({ ...d.data(), id: d.id } as Booking));
      }
      throw e;
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    throw error;
  }
};

export const updateBookingStatus = async (bookingId: string, status: string) => {
    const path = `bookings/${bookingId}`;
    try {
        await updateDoc(doc(db, 'bookings', bookingId), {
            status,
            updatedAt: serverTimestamp()
        });
    } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, path);
        throw error;
    }
}

// -- Destinations --
export const getDestinations = async () => {
    const path = 'destinations';
    try {
        const snap = await getDocs(collection(db, path));
        return snap.docs.map(d => ({ ...d.data(), id: d.id }));
    } catch (error) {
        handleFirestoreError(error, OperationType.LIST, path);
        throw error;
    }
}
export const saveDestination = async (id: string, data: any) => {
    const path = `destinations/${id}`;
    try {
        await setDoc(doc(db, 'destinations', id), {
            ...data,
            createdAt: data.createdAt || serverTimestamp()
        });
    } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, path);
        throw error;
    }
}
export const deleteDestination = async (id: string) => {
    const path = `destinations/${id}`;
    try {
        await deleteDoc(doc(db, 'destinations', id));
    } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, path);
        throw error;
    }
}

// -- Admin Flights --
export const getAdminFlights = async () => {
    const path = 'adminFlights';
    try {
        const snap = await getDocs(collection(db, path));
        return snap.docs.map(d => ({ ...d.data(), id: d.id }));
    } catch (error) {
        handleFirestoreError(error, OperationType.LIST, path);
        throw error;
    }
}
export const saveAdminFlight = async (id: string, data: any) => {
    const path = `adminFlights/${id}`;
    try {
        await setDoc(doc(db, 'adminFlights', id), {
            ...data,
            price: Number(data.price),
            stops: Number(data.stops || 0),
            createdAt: data.createdAt || serverTimestamp()
        });
    } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, path);
        throw error;
    }
}
export const deleteAdminFlight = async (id: string) => {
    const path = `adminFlights/${id}`;
    try {
        await deleteDoc(doc(db, 'adminFlights', id));
    } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, path);
        throw error;
    }
}

// -- Hotel Offers --
export const getUsers = async () => {
    const path = 'users';
    try {
        const snap = await getDocs(collection(db, path));
        return snap.docs.map(d => ({ ...d.data(), id: d.id }));
    } catch (error) {
        handleFirestoreError(error, OperationType.LIST, path);
        throw error;
    }
}
export const updateUserRole = async (id: string, role: string) => {
    const path = `users/${id}`;
    try {
        await updateDoc(doc(db, 'users', id), {
            role: role
        });
    } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, path);
        throw error;
    }
}

// -- Hotel Offers --
export const getHotelOffers = async () => {
    const path = 'hotelOffers';
    try {
        const snap = await getDocs(collection(db, path));
        return snap.docs.map(d => ({ ...d.data(), id: d.id }));
    } catch (error) {
        handleFirestoreError(error, OperationType.LIST, path);
        throw error;
    }
}
export const saveHotelOffer = async (id: string, data: any) => {
    const path = `hotelOffers/${id}`;
    try {
        await setDoc(doc(db, 'hotelOffers', id), {
            ...data,
            price: Number(data.price),
            stars: Number(data.stars || 0),
            createdAt: data.createdAt || serverTimestamp()
        });
    } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, path);
        throw error;
    }
}
export const deleteHotelOffer = async (id: string) => {
    const path = `hotelOffers/${id}`;
    try {
        await deleteDoc(doc(db, 'hotelOffers', id));
    } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, path);
        throw error;
    }
}

// -- Holiday Packages --
export const getHolidayPackages = async () => {
    const path = 'holidayPackages';
    try {
        const snap = await getDocs(collection(db, path));
        return snap.docs.map(d => ({ ...d.data(), id: d.id }));
    } catch (error) {
        handleFirestoreError(error, OperationType.LIST, path);
        throw error;
    }
}
export const saveHolidayPackage = async (id: string, data: any) => {
    const path = `holidayPackages/${id}`;
    try {
        await setDoc(doc(db, 'holidayPackages', id), {
            ...data,
            price: Number(data.price),
            createdAt: data.createdAt || serverTimestamp()
        });
    } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, path);
        throw error;
    }
}
export const deleteHolidayPackage = async (id: string) => {
    const path = `holidayPackages/${id}`;
    try {
        await deleteDoc(doc(db, 'holidayPackages', id));
    } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, path);
        throw error;
    }
}

// -- Visa Services --
export const getVisaServices = async () => {
    const path = 'visaServices';
    try {
        const snap = await getDocs(collection(db, path));
        return snap.docs.map(d => ({ ...d.data(), id: d.id }));
    } catch (error) {
        handleFirestoreError(error, OperationType.LIST, path);
        throw error;
    }
}
export const saveVisaService = async (id: string, data: any) => {
    const path = `visaServices/${id}`;
    try {
        await setDoc(doc(db, 'visaServices', id), {
            ...data,
            price: Number(data.price),
            createdAt: data.createdAt || serverTimestamp()
        });
    } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, path);
        throw error;
    }
}
export const deleteVisaService = async (id: string) => {
    const path = `visaServices/${id}`;
    try {
        await deleteDoc(doc(db, 'visaServices', id));
    } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, path);
        throw error;
    }
}

// -- Dynamic Pages (About Us, etc) --
export const getPageData = async (id: string) => {
    const path = `pages/${id}`;
    try {
        const docSnap = await getDoc(doc(db, 'pages', id));
        if (docSnap.exists()) return { ...docSnap.data(), id: docSnap.id };
        return null; 
    } catch (error) {
        handleFirestoreError(error, OperationType.GET, path);
        throw error;
    }
}
export const savePageData = async (id: string, data: any) => {
    const path = `pages/${id}`;
    try {
        await setDoc(doc(db, 'pages', id), {
            ...data,
            updatedAt: data.updatedAt || serverTimestamp()
        });
    } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, path);
        throw error;
    }
}

// -- Settings / Support Channels --
export const getSupportChannels = async () => {
    const path = `settings/support`;
    try {
        const docSnap = await getDoc(doc(db, 'settings', 'support'));
        if (docSnap.exists()) return docSnap.data();
        return null;
    } catch (error) {
        handleFirestoreError(error, OperationType.GET, path);
        throw error;
    }
}
export const saveSupportChannels = async (data: any) => {
    const path = `settings/support`;
    try {
        await setDoc(doc(db, 'settings', 'support'), {
            ...data,
            updatedAt: serverTimestamp()
        }, { merge: true });
    } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, path);
        throw error;
    }
}

// -- Jobs --
export const getJobs = async () => {
    const path = 'jobs';
    try {
        const snap = await getDocs(collection(db, path));
        return snap.docs.map(d => ({ ...d.data(), id: d.id }));
    } catch (error) {
        handleFirestoreError(error, OperationType.LIST, path);
        throw error;
    }
}
export const saveJob = async (id: string, data: any) => {
    const path = `jobs/${id}`;
    try {
        await setDoc(doc(db, 'jobs', id), {
            ...data,
            createdAt: data.createdAt || serverTimestamp()
        });
    } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, path);
        throw error;
    }
}
export const deleteJob = async (id: string) => {
    const path = `jobs/${id}`;
    try {
        await deleteDoc(doc(db, 'jobs', id));
    } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, path);
        throw error;
    }
}

// -- Press Releases --
export const getPressReleases = async () => {
    const path = 'pressReleases';
    try {
        const snap = await getDocs(collection(db, path));
        return snap.docs.map(d => ({ ...d.data(), id: d.id }));
    } catch (error) {
        handleFirestoreError(error, OperationType.LIST, path);
        throw error;
    }
}
export const savePressRelease = async (id: string, data: any) => {
    const path = `pressReleases/${id}`;
    try {
        await setDoc(doc(db, 'pressReleases', id), {
            ...data,
            createdAt: data.createdAt || serverTimestamp()
        });
    } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, path);
        throw error;
    }
}
export const deletePressRelease = async (id: string) => {
    const path = `pressReleases/${id}`;
    try {
        await deleteDoc(doc(db, 'pressReleases', id));
    } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, path);
        throw error;
    }
}

// -- Blog Posts --
export const getBlogPosts = async () => {
    const path = 'blogPosts';
    try {
        const snap = await getDocs(collection(db, path));
        return snap.docs.map(d => ({ ...d.data(), id: d.id }));
    } catch (error) {
        handleFirestoreError(error, OperationType.LIST, path);
        throw error;
    }
}
export const saveBlogPost = async (id: string, data: any) => {
    const path = `blogPosts/${id}`;
    try {
        await setDoc(doc(db, 'blogPosts', id), {
            ...data,
            createdAt: data.createdAt || serverTimestamp()
        });
    } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, path);
        throw error;
    }
}
export const deleteBlogPost = async (id: string) => {
    const path = `blogPosts/${id}`;
    try {
        await deleteDoc(doc(db, 'blogPosts', id));
    } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, path);
        throw error;
    }
}

// -- Payment Methods --
export const getPaymentMethodsConfig = async () => {
    const path = 'settings/paymentMethods';
    try {
        const docSnap = await getDoc(doc(db, 'settings', 'paymentMethods'));
        if (docSnap.exists()) {
            return docSnap.data();
        }
        return { card: true, bkash: true }; // defaults
    } catch (error) {
        handleFirestoreError(error, OperationType.GET, path);
        throw error;
    }
}

export const savePaymentMethodsConfig = async (data: any) => {
    const path = 'settings/paymentMethods';
    try {
        await setDoc(doc(db, 'settings', 'paymentMethods'), data);
    } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, path);
        throw error;
    }
}

export const getFeaturesConfig = async () => {
    const path = 'settings/features';
    try {
        const docSnap = await getDoc(doc(db, 'settings', 'features'));
        if (docSnap.exists()) return docSnap.data();
        return { 
            flightsEnabled: true,
            hotelsEnabled: true, 
            holidaysEnabled: true,
            visaEnabled: true,
            destinationsEnabled: true,
            blogEnabled: true,
            careersEnabled: true,
            pressEnabled: true
        };
    } catch (error) {
        handleFirestoreError(error, OperationType.GET, path);
        throw error;
    }
}

export const saveFeaturesConfig = async (data: any) => {
    const path = 'settings/features';
    try {
        await setDoc(doc(db, 'settings', 'features'), data);
    } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, path);
        throw error;
    }
}

export const saveConsultation = async (data: any) => {
    const path = 'consultations';
    try {
        await addDoc(collection(db, path), {
            ...data,
            status: 'pending',
            createdAt: serverTimestamp()
        });
    } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, path);
        throw error;
    }
}

export const getConsultations = async () => {
    const path = 'consultations';
    try {
        const snap = await getDocs(query(collection(db, path), orderBy('createdAt', 'desc')));
        return snap.docs.map(d => ({ ...d.data(), id: d.id }));
    } catch (error) {
        handleFirestoreError(error, OperationType.LIST, path);
        return [];
    }
}

export const updateConsultationStatus = async (id: string, status: string) => {
    const path = `consultations/${id}`;
    try {
        await updateDoc(doc(db, 'consultations', id), { status });
    } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, path);
        throw error;
    }
}

export const updateConsultationNotes = async (id: string, notes: string) => {
    const path = `consultations/${id}`;
    try {
        await updateDoc(doc(db, 'consultations', id), { notes });
    } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, path);
        throw error;
    }
}
