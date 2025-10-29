import { useState } from 'react';
import { SkillGroup } from '../components/types';
import { addSkill, type SkillData } from '@/lib/resume-api';
import toast from 'react-hot-toast';

export function useSkills(resumeId: number | null) {
  const [coreSkillGroups, setCoreSkillGroups] = useState<SkillGroup[]>([]);
  const [softSkillGroups, setSoftSkillGroups] = useState<SkillGroup[]>([]);
  const [isSkillDialogOpen, setIsSkillDialogOpen] = useState(false);

  const openSkillDialog = () => {
    setIsSkillDialogOpen(true);
  };

  const saveSkills = async (skills: Array<{ skill: string; experience?: string }>, skillType: 'core' | 'soft') => {
    if (!resumeId) {
      toast.error("Resume ID not found. Please refresh the page.");
      return;
    }

    if (skills.length === 0) {
      toast.error("Please add at least one skill");
      return;
    }

    try {
      const apiCalls = skills.map(skill => {
        const data: SkillData = {
          resumeId,
          skillType: skillType,
          skillName: skill.skill,
          ...(skillType === "core" && skill.experience ? { yearOfExperience: parseInt(skill.experience) } : {})
        };
        return addSkill(data);
      });

      const results = await Promise.all(apiCalls);

      if (skillType === "core") {
        const items = skills
          .filter((s) => s.skill && s.experience)
          .map((s, index) => ({
            id: results[index]?.skillId?.toString() || Date.now().toString(),
            skill: s.skill,
            experience: s.experience!
          }));

        if (items.length > 0) {
          const newGroup: SkillGroup = {
            id: Date.now().toString(),
            name: 'Core Skills',
            items: items
          };
          setCoreSkillGroups([...coreSkillGroups, newGroup]);
        }
      } else if (skillType === "soft") {
        const items = skills.filter((s) => s.skill).map((s, index) => ({
          id: results[index]?.skillId?.toString() || Date.now().toString(),
          skill: s.skill
        }));

        if (items.length > 0) {
          const newGroup: SkillGroup = {
            id: Date.now().toString(),
            name: 'Soft Skills',
            items: items
          };
          setSoftSkillGroups([...softSkillGroups, newGroup]);
        }
      }

      toast.success(`${skills.length} skill(s) added successfully!`);
      setIsSkillDialogOpen(false);
    } catch (error) {
      console.error("Error adding skills:", error);
      toast.error("Failed to add skills. Please try again.");
    }
  };

  return {
    coreSkillGroups,
    setCoreSkillGroups,
    softSkillGroups,
    setSoftSkillGroups,
    isSkillDialogOpen,
    setIsSkillDialogOpen,
    openSkillDialog,
    saveSkills
  };
}
