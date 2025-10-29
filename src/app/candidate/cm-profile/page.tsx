"use client";

import { useState, useEffect } from "react";
import CVSidebar from "@/components/layout/CVSidebar";
import { useLayout } from "@/contexts/LayoutContext";
import api from "@/lib/api";
import {
  ProfileHeaderCard,
  AboutMeSection,
  EducationSection,
  WorkExperienceSection,
  LanguageSection,
  SkillsSection,
  HighlightProjectsSection,
  CertificatesSection,
  AwardsSection,
  ProfileStrengthSidebar,
  AboutMeDialog,
  PersonalDetailDialog,
  EducationDialog,
  WorkExperienceDialog,
  LanguageDialog,
  ProjectDialog,
  AwardDialog,
  CertificateDialog,
  SkillsDialog,
} from "./components";
import {
  addSkill,
  type SkillData,
} from "@/lib/resume-api";
import toast from "react-hot-toast";
import {
  useEducation,
  useWorkExperience,
  useLanguages,
  useProjects,
  useAwards,
  useCertificates,
  useSkills,
  useAboutMe
} from "./hooks";

export default function ITviecProfile() {
  // Resume ID state - will be fetched from API
  const [resumeId, setResumeId] = useState<number | null>(null);
  const [isLoadingResume, setIsLoadingResume] = useState(true);

  // Custom hooks for data management
  const educationHook = useEducation(resumeId);
  const workExpHook = useWorkExperience(resumeId);
  const languagesHook = useLanguages(resumeId);
  const projectsHook = useProjects(resumeId);
  const awardsHook = useAwards(resumeId);
  const certificatesHook = useCertificates(resumeId);
  const skillsHook = useSkills(resumeId);
  const aboutMeHook = useAboutMe(resumeId);

  // UI state
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [skillType, setSkillType] = useState<string>("");
  const [selectedSkill, setSelectedSkill] = useState<string>("");
  const [skillExperience, setSkillExperience] = useState<string>("");
  const [skills, setSkills] = useState<Array<{
    id: string;
    skill: string;
    experience?: string;
  }>>([]);
  const { headerHeight } = useLayout();
  const [headerH, setHeaderH] = useState(headerHeight || 0);
  const [popoverOpen, setPopoverOpen] = useState(false);

  // Personal Detail modal state
  const [isPersonalDetailOpen, setIsPersonalDetailOpen] = useState(false);
  const [profileName, setProfileName] = useState("");
  const [profileTitle, setProfileTitle] = useState("");
  const [profilePhone, setProfilePhone] = useState("");
  const [profileDob, setProfileDob] = useState("");
  const [profileGender, setProfileGender] = useState("");
  const [profileAddress, setProfileAddress] = useState("");
  const [profileLink, setProfileLink] = useState("");
  const [profileImage, setProfileImage] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedHeight = localStorage.getItem("headerHeight");
      if (savedHeight && !headerHeight) {
        setHeaderH(parseInt(savedHeight));
      } else if (headerHeight) {
        setHeaderH(headerHeight);
      }
    }
  }, [headerHeight]);

  // Auto-create profile and resume on page load
  useEffect(() => {
    const initializeProfileAndResume = async () => {
      try {
        // Check if there's a pending DoB from sign-up
        const pendingDob = typeof window !== "undefined"
          ? localStorage.getItem("pending_profile_dob")
          : null;

        if (pendingDob) {
          // Create candidate profile with DoB from sign-up
          try {
            const profilePayload = {
              dob: pendingDob,
              title: "",
              phone: "",
              address: "",
              image: "",
              gender: "",
              link: ""
            };
            await api.post("/api/candidates/profiles", profilePayload);
            console.log("Candidate profile created successfully with DoB:", pendingDob);
            // Clear the pending DoB after successful creation
            localStorage.removeItem("pending_profile_dob");
          } catch (profileError: any) {
            // If profile already exists (409/400), clear the flag
            if (profileError?.response?.status === 409 || profileError?.response?.status === 400) {
              localStorage.removeItem("pending_profile_dob");
            }
            console.log("Profile creation skipped:", profileError?.response?.data?.message || profileError?.message);
          }
        }

        // Create resume (blank)
        try {
          const resumePayload = {
            aboutMe: ""
          };
          await api.post("/api/resumes", resumePayload);
          console.log("Resume created successfully");
        } catch (resumeError: any) {
          console.log("Resume creation skipped:", resumeError?.response?.data?.message || resumeError?.message);
        }
      } catch (error: any) {
        console.log("Initialization error:", error?.message);
      }
    };

    initializeProfileAndResume();
  }, []);

  // Fetch resume data to get resumeId and all related data
  useEffect(() => {
    const fetchResumeData = async () => {
      setIsLoadingResume(true);
      try {
        const response = await api.get("/api/resume");

        if (response.data?.result && response.data.result.length > 0) {
          const resume = response.data.result[0]; // Get first resume
          console.log("📋 Resume data:", resume);
          console.log("🆔 Resume ID:", resume.resumeId, "Type:", typeof resume.resumeId);
          setResumeId(resume.resumeId);

          // Load About Me
          if (resume.aboutMe) {
            aboutMeHook.setAboutMeText(resume.aboutMe);
          }

          // Load Awards
          if (resume.awards && resume.awards.length > 0) {
            const transformedAwards = resume.awards.map((award: any) => {
              const date = new Date(award.getDate);
              return {
                id: award.awardId.toString(),
                name: award.name,
                organization: award.organization,
                month: String(date.getMonth() + 1).padStart(2, '0'),
                year: String(date.getFullYear()),
                description: award.description
              };
            });
            awardsHook.setAwards(transformedAwards);
          }

          // Load Education
          if (resume.educations && resume.educations.length > 0) {
            const transformedEducations = resume.educations.map((edu: any) => {
              const startDate = new Date(edu.startDate);
              const endDate = edu.endDate ? new Date(edu.endDate) : null;
              return {
                id: edu.educationId.toString(),
                school: edu.school,
                degree: edu.degree,
                major: edu.major,
                startMonth: String(startDate.getMonth() + 1).padStart(2, '0'),
                startYear: String(startDate.getFullYear()),
                endMonth: endDate ? String(endDate.getMonth() + 1).padStart(2, '0') : '',
                endYear: endDate ? String(endDate.getFullYear()) : ''
              };
            });
            educationHook.setEducations(transformedEducations);
          }

          // Load Highlight Projects
          if (resume.highlightProjects && resume.highlightProjects.length > 0) {
            const transformedProjects = resume.highlightProjects.map((project: any) => {
              const startDate = new Date(project.startDate);
              const endDate = project.endDate ? new Date(project.endDate) : null;
              return {
                id: project.highlightProjectId.toString(),
                name: project.name,
                startMonth: String(startDate.getMonth() + 1).padStart(2, '0'),
                startYear: String(startDate.getFullYear()),
                endMonth: endDate ? String(endDate.getMonth() + 1).padStart(2, '0') : '',
                endYear: endDate ? String(endDate.getFullYear()) : '',
                description: project.description,
                url: project.projectUrl,
                working: !project.endDate
              };
            });
            projectsHook.setProjects(transformedProjects);
          }

          // Load Work Experience
          if (resume.workExperiences && resume.workExperiences.length > 0) {
            const transformedWorkExp = resume.workExperiences.map((exp: any) => {
              const startDate = new Date(exp.startDate);
              const endDate = exp.endDate ? new Date(exp.endDate) : null;
              return {
                id: exp.workExperienceId.toString(),
                jobTitle: exp.jobTitle,
                company: exp.company,
                startMonth: String(startDate.getMonth() + 1).padStart(2, '0'),
                startYear: String(startDate.getFullYear()),
                endMonth: endDate ? String(endDate.getMonth() + 1).padStart(2, '0') : '',
                endYear: endDate ? String(endDate.getFullYear()) : '',
                description: exp.description,
                project: exp.project,
                working: !exp.endDate
              };
            });
            workExpHook.setWorkExperiences(transformedWorkExp);
          }

          // Load Foreign Languages
          if (resume.foreignLanguages && resume.foreignLanguages.length > 0) {
            const transformedLanguages = resume.foreignLanguages.map((lang: any) => ({
              id: lang.foreignLanguageId.toString(),
              language: lang.language,
              level: lang.level
            }));
            languagesHook.setLanguages(transformedLanguages);
          }

          // Load Certificates
          if (resume.certificates && resume.certificates.length > 0) {
            const transformedCerts = resume.certificates.map((cert: any) => {
              const date = new Date(cert.getDate);
              return {
                id: cert.certificateId.toString(),
                name: cert.name,
                org: cert.organization,
                month: String(date.getMonth() + 1).padStart(2, '0'),
                year: String(date.getFullYear()),
                url: cert.certificateUrl,
                desc: cert.description
              };
            });
            certificatesHook.setCertificates(transformedCerts);
          }

          // Load Skills
          if (resume.skills && resume.skills.length > 0) {
            const coreSkills = resume.skills.filter((skill: any) => skill.skillType === "core");
            const softSkills = resume.skills.filter((skill: any) => skill.skillType === "soft");

            // Transform core skills
            if (coreSkills.length > 0) {
              const coreSkillItems = coreSkills.map((skill: any) => ({
                id: skill.skillId.toString(),
                skill: skill.skillName,
                experience: skill.yearOfExperience ? String(skill.yearOfExperience) : ''
              }));

              skillsHook.setCoreSkillGroups([{
                id: 'core-group-1',
                name: 'Core Skills',
                items: coreSkillItems
              }]);
            }

            // Transform soft skills
            if (softSkills.length > 0) {
              const softSkillItems = softSkills.map((skill: any) => ({
                id: skill.skillId.toString(),
                skill: skill.skillName
              }));

              skillsHook.setSoftSkillGroups([{
                id: 'soft-group-1',
                name: 'Soft Skills',
                items: softSkillItems
              }]);
            }
          }

          console.log("Resume data loaded successfully, resumeId:", resume.resumeId);
        }
      } catch (error) {
        console.error("Error fetching resume data:", error);
        toast.error("Failed to load resume data");
      } finally {
        setIsLoadingResume(false);
      }
    };

    fetchResumeData();
  }, []);

  // Fetch personal details (candidate profile)
  useEffect(() => {
    const fetchPersonalDetails = async () => {
      try {
        const response = await api.get("/api/candidates/profiles/me");
        if (response.data?.result) {
          const profile = response.data.result;
          console.log("👤 Personal details loaded:", profile);

          // Set personal detail states
          setProfileName(profile.username || "");
          setProfileTitle(profile.title || "");
          setProfilePhone(profile.phone || "");
          setProfileDob(profile.dob || "");
          setProfileGender(profile.gender || "");
          setProfileAddress(profile.address || "");
          setProfileLink(profile.link || "");
          setProfileImage(profile.image || "");
        }
      } catch (error) {
        console.error("Error fetching personal details:", error);
        // Don't show error toast on initial load if profile doesn't exist
      }
    };

    fetchPersonalDetails();
  }, []);

  const toggleSection = (section: string) => {
    setExpandedSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section]
    );
  };

  const handleAddSkill = () => {
    if (!selectedSkill) return;
    // For core skills, require experience; for soft, ignore experience
    if (skillType === "core" && !skillExperience) return;
    const newItem = {
      id: Date.now().toString(),
      skill: selectedSkill,
      ...(skillType === "core" ? { experience: skillExperience } : {}),
    } as { id: string; skill: string; experience?: string };

    setSkills((prev) => [...prev, newItem]);
    setSelectedSkill("");
    if (skillType === "core") setSkillExperience("");
  };

  const handleRemoveSkill = (id: string) => {
    setSkills(skills.filter(skill => skill.id !== id));
  };

  const handleSaveSkills = async () => {
    if (!resumeId) {
      toast.error("Resume ID not found. Please refresh the page.");
      return;
    }

    if (skills.length === 0) {
      toast.error("Please add at least one skill");
      return;
    }

    try {
      // Call API for each skill
      const apiCalls = skills.map(skill => {
        const data: SkillData = {
          resumeId,
          skillType: skillType, // "core" or "soft"
          skillName: skill.skill,
          ...(skillType === "core" && skill.experience ? { yearOfExperience: parseInt(skill.experience) } : {})
        };
        return addSkill(data);
      });

      const results = await Promise.all(apiCalls);

      if (skillType === "core") {
        // Save core skills
        const items = skills
          .filter((s) => s.skill && s.experience)
          .map((s, index) => ({
            id: results[index]?.skillId?.toString() || s.id,
            skill: s.skill,
            experience: s.experience!
          }));

        if (items.length > 0) {
          // Group all core skills together without separate group names
          skillsHook.setCoreSkillGroups((prev) => {
            if (prev.length > 0) {
              // Add to existing core skills group
              const updated = [...prev];
              updated[0].items = [...updated[0].items, ...items];
              return updated;
            } else {
              // Create first core skills group
              return [{
                id: Date.now().toString(),
                name: "Core Skills",
                items
              }];
            }
          });
        }
      } else if (skillType === "soft") {
        // Append to soft skills list
        const items = skills.filter((s) => s.skill).map((s, index) => ({
          id: results[index]?.skillId?.toString() || s.id,
          skill: s.skill
        }));

        if (items.length > 0) {
          skillsHook.setSoftSkillGroups((prev) => {
            if (prev.length > 0) {
              // Add to existing soft skills
              const updated = [...prev];
              updated[0].items = [...updated[0].items, ...items];
              return updated;
            } else {
              return [{
                id: Date.now().toString(),
                name: "Soft Skills",
                items
              }];
            }
          });
        }
      }

      toast.success(`${skills.length} skill(s) added successfully!`);

      // Close and reset form
      skillsHook.setIsSkillDialogOpen(false);
      setSkillType("");
      setSkills([]);
      setSelectedSkill("");
      setSkillExperience("");
    } catch (error) {
      console.error("Error adding skills:", error);
      toast.error("Failed to add skills. Please try again.");
    }
  };

  const handleCancelSkills = () => {
    skillsHook.setIsSkillDialogOpen(false);
    // Reset form
    setSkillType("");
    setSkills([]);
    setSelectedSkill("");
    setSkillExperience("");
  };

  // Personal Detail handlers
  const handleSavePersonalDetail = async () => {
    if (!profileAddress) {
      toast.error("Address is required");
      return;
    }

    try {
      // Update username via /api/users/account
      if (profileName) {
        await api.put("/api/users/account", {
          username: profileName
        });
      }

      // Update profile via /api/candidates/profiles
      const profileData = {
        dob: profileDob || undefined,
        title: profileTitle || undefined,
        phone: profilePhone || undefined,
        address: profileAddress,
        image: profileImage || undefined,
        gender: profileGender || undefined,
        link: profileLink || undefined
      };

      await api.put("/api/candidates/profiles", profileData);

      toast.success("Personal details updated successfully!");
      setIsPersonalDetailOpen(false);
    } catch (error) {
      console.error("Error updating personal details:", error);
      toast.error("Failed to update personal details. Please try again.");
    }
  };


  const profileCompletion = 20; // 20% completed

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="mx-auto max-w-7xl px-4 py-6 md:px-6">
        <div
          className="grid grid-cols-1 lg:grid-cols-[16rem_minmax(0,1fr)_18rem] gap-6 items-start transition-all duration-300"
          style={{
            ["--sticky-offset" as any]: `${headerH}px`,
            ["--content-pad" as any]: "24px",
          }}
        >
          {/* Sidebar */}
          <aside className="hidden lg:block sticky [top:calc(var(--sticky-offset)+var(--content-pad))] self-start transition-all duration-300">
            <CVSidebar activePage="cm-profile" />
          </aside>

          {/* Main Content */}
          <section className="space-y-6 min-w-0 lg:mt-[var(--sticky-offset)] transition-all duration-300">
            {/* Profile Header */}
            <ProfileHeaderCard
              profileName={profileName}
              profileTitle={profileTitle}
              profileImage={profileImage}
              profilePhone={profilePhone}
              profileDob={profileDob}
              profileGender={profileGender}
              profileAddress={profileAddress}
              profileLink={profileLink}
              email="anhlqde180272@fpt.edu.vn"
              onEditPersonalDetails={() => setIsPersonalDetailOpen(true)}
            />

            {/* About Me */}
            <AboutMeSection
              aboutMeText={aboutMeHook.aboutMeText}
              onEdit={() => aboutMeHook.setIsAboutMeOpen(true)}
            />

            {/* Education */}
            <EducationSection
              educations={educationHook.educations}
              onAdd={() => educationHook.openEducationDialog()}
              onEdit={(edu) => educationHook.openEducationDialog(edu)}
              onRemove={educationHook.removeEducation}
            />

            {/* Work Experience */}
            <WorkExperienceSection
              workExperiences={workExpHook.workExperiences}
              onAdd={() => workExpHook.openWorkExpDialog()}
              onEdit={(exp) => workExpHook.openWorkExpDialog(exp)}
              onRemove={workExpHook.removeWorkExp}
            />

            {/* Foreign Language */}
            <LanguageSection
              languages={languagesHook.languages}
              onAdd={() => languagesHook.openLanguageDialog()}
              onEdit={(lang) => {
                // Language edit uses same dialog as add
                languagesHook.openLanguageDialog();
              }}
              onRemove={languagesHook.removeLanguage}
            />

            {/* Skills */}
            <SkillsSection
              coreSkillGroups={skillsHook.coreSkillGroups}
              softSkillItems={skillsHook.softSkillGroups[0]?.items || []}
              onAddCoreSkills={() => {
                setSkillType("core");
                skillsHook.setIsSkillDialogOpen(true);
              }}
              onAddSoftSkills={() => {
                setSkillType("soft");
                skillsHook.setIsSkillDialogOpen(true);
              }}
              popoverOpen={popoverOpen}
              setPopoverOpen={setPopoverOpen}
            />

            {/* Highlight Project */}
            <HighlightProjectsSection
              projects={projectsHook.projects}
              onAdd={() => projectsHook.openProjectDialog()}
              onEdit={(project) => projectsHook.openProjectDialog(project)}
              onRemove={projectsHook.removeProject}
            />

            {/* Certificates */}
            <CertificatesSection
              certificates={certificatesHook.certificates}
              onAdd={() => certificatesHook.openCertDialog()}
              onEdit={(cert) => certificatesHook.openCertDialog(cert)}
              onRemove={certificatesHook.removeCertificate}
            />

            {/* Awards */}
            <AwardsSection
              awards={awardsHook.awards}
              onAdd={() => awardsHook.openAwardsDialog()}
              onEdit={(award) => awardsHook.openAwardsDialog(award)}
              onRemove={awardsHook.removeAward}
            />
          </section>

          {/* Right Sidebar - Profile Strength */}
          <ProfileStrengthSidebar
            profileCompletion={profileCompletion}
            expandedSections={expandedSections}
            onToggleSection={toggleSection}
          />
        </div>
      </main>

      {/* Skills Dialog Component */}
      <SkillsDialog
        open={skillsHook.isSkillDialogOpen}
        onOpenChange={skillsHook.setIsSkillDialogOpen}
        skillType={skillType as 'core' | 'soft' | ''}
        skills={skills}
        selectedSkill={selectedSkill}
        skillExperience={skillExperience}
        onSelectedSkillChange={setSelectedSkill}
        onSkillExperienceChange={setSkillExperience}
        onAddSkill={handleAddSkill}
        onRemoveSkill={handleRemoveSkill}
        onSave={handleSaveSkills}
        onCancel={handleCancelSkills}
      />

      {/* Certificate Dialog Component */}
      <CertificateDialog
        open={certificatesHook.isCertDialogOpen}
        onOpenChange={certificatesHook.setIsCertDialogOpen}
        editingCertificate={certificatesHook.editingCert}
        onEditingCertificateChange={certificatesHook.setEditingCert}
        onSave={certificatesHook.saveCertificate}
      />

      {/* About Me Modal */}
      <AboutMeDialog
        open={aboutMeHook.isAboutMeOpen}
        onOpenChange={aboutMeHook.setIsAboutMeOpen}
        value={aboutMeHook.aboutMeText}
        onChange={aboutMeHook.handleAboutMeChange}
        onSave={aboutMeHook.saveAboutMe}
        maxLength={2500}
      />

      {/* Personal Detail Modal */}
      <PersonalDetailDialog
        open={isPersonalDetailOpen}
        onOpenChange={setIsPersonalDetailOpen}
        profileName={profileName}
        profileTitle={profileTitle}
        profilePhone={profilePhone}
        profileDob={profileDob}
        profileGender={profileGender}
        profileAddress={profileAddress}
        profileLink={profileLink}
        profileImage={profileImage}
        onProfileNameChange={setProfileName}
        onProfileTitleChange={setProfileTitle}
        onProfilePhoneChange={setProfilePhone}
        onProfileDobChange={setProfileDob}
        onProfileGenderChange={setProfileGender}
        onProfileAddressChange={setProfileAddress}
        onProfileLinkChange={setProfileLink}
        onProfileImageChange={setProfileImage}
        onSave={handleSavePersonalDetail}
      />

      {/* Education Modal */}
      <EducationDialog
        open={educationHook.isEducationOpen}
        onOpenChange={educationHook.setIsEducationOpen}
        editingEducation={educationHook.editingEducation}
        onEditingEducationChange={educationHook.setEditingEducation}
        onSave={educationHook.saveEducation}
      />

      {/* Work Experience Dialog Component */}
      <WorkExperienceDialog
        open={workExpHook.isWorkExpOpen}
        onOpenChange={workExpHook.setIsWorkExpOpen}
        editingWorkExp={workExpHook.editingWorkExp}
        onEditingWorkExpChange={workExpHook.setEditingWorkExp}
        onSave={workExpHook.saveWorkExp}
      />

      {/* Language Dialog Component */}
      <LanguageDialog
        open={languagesHook.isLanguageOpen}
        onOpenChange={languagesHook.setIsLanguageOpen}
        languages={languagesHook.languages}
        onLanguagesChange={languagesHook.setLanguages}
        onSave={languagesHook.saveLanguages}
      />

      {/* Award Dialog Component */}
      <AwardDialog
        open={awardsHook.isAwardsOpen}
        onOpenChange={awardsHook.setIsAwardsOpen}
        editingAward={awardsHook.editingAward}
        onEditingAwardChange={awardsHook.setEditingAward}
        onSave={awardsHook.saveAward}
      />

      {/* Project Dialog Component */}
      <ProjectDialog
        open={projectsHook.isProjectOpen}
        onOpenChange={projectsHook.setIsProjectOpen}
        editingProject={projectsHook.editingProject}
        onEditingProjectChange={projectsHook.setEditingProject}
        onSave={projectsHook.saveProject}
      />

      {/* Certificate Dialog Component */}
      <CertificateDialog
        open={certificatesHook.isCertDialogOpen}
        onOpenChange={certificatesHook.setIsCertDialogOpen}
        editingCertificate={certificatesHook.editingCert}
        onEditingCertificateChange={certificatesHook.setEditingCert}
        onSave={certificatesHook.saveCertificate}
      />
    </div>
  );
}
