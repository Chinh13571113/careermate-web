import { create } from 'zustand';
import { devtools } from 'zustand/middleware';


// CV Type definitions
export type CVType = 'CREATED' | 'UPLOADED';

export interface CV {
  id: string;
  name: string;
  type: CVType;                  // created or uploaded
  status: 'DRAFT' | 'READY';     // draft or final
  isDefault: boolean;            // the default CV for job apply
  storagePath: string;           // CareerMatefiles/candidates/{userId}/cv/xxx.pdf
  downloadUrl?: string;          // Firebase download URL
  updatedAt: string;             // ISO string
}

// Zustand Store State
interface CVStoreState {
  cvs: CV[];
  defaultCvId: string | null;
  activeCvId: string | null;
  setCVs: (cvs: CV[]) => void;
  upsertCv: (cv: CV) => void;
  setDefaultCv: (cvId: string) => Promise<void>;
  setActiveCv: (cvId: string | null) => void;
}

// Mock API for setDefaultCv - replace with your actual API implementation
const cvApi = {
  setDefault: async (cvId: string): Promise<void> => {
    // TODO: Replace this with actual API call
    // Example: await api.patch(`/api/cv/${cvId}/set-default`);
    console.log(`Setting CV ${cvId} as default`);
    return Promise.resolve();
  },
};

// Create the Zustand store
export const useCVStore = create<CVStoreState>()(
  devtools(
    (set, get) => ({
      cvs: [],
      defaultCvId: null,
      activeCvId: null,

      /**
       * Replace the entire CV list and detect the default CV
       */
      setCVs: (cvs: CV[]) => {
        const defaultCv = cvs.find((c) => c.isDefault);
        set({
          cvs,
          defaultCvId: defaultCv?.id ?? null,
        });
      },

      /**
       * Upsert a CV:
       * - If CV exists → replace it
       * - If not → prepend it to the list
       * - If cv.isDefault === true → make it the only default
       */
      upsertCv: (cv: CV) => {
        set((state) => {
          const existingIndex = state.cvs.findIndex((c) => c.id === cv.id);
          let updatedCvs: CV[];

          if (existingIndex !== -1) {
            // Replace existing CV
            updatedCvs = [...state.cvs];
            updatedCvs[existingIndex] = cv;
          } else {
            // Prepend new CV
            updatedCvs = [cv, ...state.cvs];
          }

          // If this CV is marked as default, unset all others
          if (cv.isDefault) {
            updatedCvs = updatedCvs.map((c) =>
              c.id === cv.id ? c : { ...c, isDefault: false }
            );
          }

          return {
            cvs: updatedCvs,
            defaultCvId: cv.isDefault ? cv.id : state.defaultCvId,
          };
        });
      },

      /**
       * Set a CV as the default:
       * - Call API to persist the change
       * - Update Zustand state: only the selected CV becomes isDefault = true
       * - Update defaultCvId
       */
      setDefaultCv: async (cvId: string) => {
        try {
          // Call API to set default
          await cvApi.setDefault(cvId);

          // Update state after successful API call
          set((state) => ({
            cvs: state.cvs.map((cv) => ({
              ...cv,
              isDefault: cv.id === cvId,
            })),
            defaultCvId: cvId,
          }));
        } catch (error) {
          console.error('Failed to set default CV:', error);
          throw error;
        }
      },

      /**
       * Set the active CV ID (for UI selection/highlighting)
       */
      setActiveCv: (cvId: string | null) => {
        set({ activeCvId: cvId });
      },
    }),
    {
      name: 'cv-store',
    }
  )
);
