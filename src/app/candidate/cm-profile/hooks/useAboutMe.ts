import { useState } from 'react';
import { updateResume, type UpdateResumeData } from '@/lib/resume-api';
import toast from 'react-hot-toast';

export function useAboutMe(resumeId: number | null) {
  const [aboutMeText, setAboutMeText] = useState("");
  const [isAboutMeOpen, setIsAboutMeOpen] = useState(false);

  const openAboutMeDialog = () => {
    setIsAboutMeOpen(true);
  };

  const handleAboutMeChange = (value: string) => {
    if (value.length <= 2500) {
      setAboutMeText(value);
    }
  };

  const saveAboutMe = async () => {
    if (!resumeId) {
      toast.error("Resume ID not found. Please refresh the page.");
      return;
    }

    try {
      const data: UpdateResumeData = {
        aboutMe: aboutMeText
      };

      await updateResume(resumeId, data);
      toast.success("About Me updated successfully!");
      setIsAboutMeOpen(false);
    } catch (error) {
      console.error("Error updating About Me:", error);
      toast.error("Failed to update About Me. Please try again.");
    }
  };

  return {
    aboutMeText,
    setAboutMeText,
    isAboutMeOpen,
    setIsAboutMeOpen,
    openAboutMeDialog,
    handleAboutMeChange,
    saveAboutMe
  };
}
