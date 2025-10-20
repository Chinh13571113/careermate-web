"use client";

import { useState, useEffect } from "react";
import CVSidebar from "@/components/layout/CVSidebar";
import { Edit2, Plus, Trash2, ChevronDown, ChevronUp, X } from "lucide-react";
import { useLayout } from "@/contexts/LayoutContext";
import api from "@/lib/api";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

export default function ITviecProfile() {
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [isSkillDialogOpen, setIsSkillDialogOpen] = useState(false);
  const [skillGroupName, setSkillGroupName] = useState("");
  const [skillType, setSkillType] = useState<string>("");
  const [selectedSkill, setSelectedSkill] = useState<string>("");
  const [skillExperience, setSkillExperience] = useState<string>("");
  // Working list inside the dialog (experience optional for soft skills)
  const [skills, setSkills] = useState<Array<{
    id: string;
    skill: string;
    experience?: string;
  }>>([]);
  // Persisted data shown on the main page
  const [coreSkillGroups, setCoreSkillGroups] = useState<
    Array<{
      id: string;
      name: string;
      items: Array<{ id: string; skill: string; experience: string }>
    }>
  >([]);
  const [softSkillItems, setSoftSkillItems] = useState<
    Array<{ id: string; skill: string }>
  >([]);
  const { headerHeight } = useLayout();
  const [headerH, setHeaderH] = useState(headerHeight || 0);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [pendingSkillType, setPendingSkillType] = useState<string>("");
  // Certificates state
  const [isCertDialogOpen, setIsCertDialogOpen] = useState(false);
  const [certName, setCertName] = useState("");
  const [certOrg, setCertOrg] = useState("");
  const [certMonth, setCertMonth] = useState<string>("");
  const [certYear, setCertYear] = useState<string>("");
  const [certUrl, setCertUrl] = useState("");
  const [certDesc, setCertDesc] = useState("");
  const [certificates, setCertificates] = useState<Array<{
    id: string;
    name: string;
    org: string;
    month: string;
    year: string;
    url?: string;
    desc?: string;
  }>>([]);
  const [isCertSaving, setIsCertSaving] = useState(false);

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

  const handleSaveSkills = () => {
    if (skillType === "core") {
      // Save as a new core group
      const groupId = Date.now().toString();
      const items = skills
        .filter((s) => s.skill && s.experience)
        .map((s) => ({ id: s.id, skill: s.skill, experience: s.experience! }));
      if (skillGroupName && items.length > 0) {
        setCoreSkillGroups((prev) => [
          ...prev,
          { id: groupId, name: skillGroupName, items },
        ]);
      }
    } else if (skillType === "soft") {
      // Append to soft skills list
      const items = skills.filter((s) => s.skill).map((s) => ({ id: s.id, skill: s.skill }));
      if (items.length > 0) {
        setSoftSkillItems((prev) => [...prev, ...items]);
      }
    }

    // Close and reset form
    setIsSkillDialogOpen(false);
    setSkillGroupName("");
    setSkillType("");
    setSkills([]);
    setSelectedSkill("");
    setSkillExperience("");
  };

  const handleCancelSkills = () => {
    setIsSkillDialogOpen(false);
    // Reset form
    setSkillGroupName("");
    setSkillType("");
    setSkills([]);
    setSelectedSkill("");
    setSkillExperience("");
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
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
                    <span className="text-2xl font-semibold text-gray-600">
                      LA
                    </span>
                  </div>
                  <div>
                    <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                      Lê Quang Anh
                    </h1>
                    <button className="text-sm text-gray-500 hover:text-gray-700 flex items-center space-x-1">
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Update your title</span>
                    </button>
                  </div>
                </div>
                <button className="text-gray-600 hover:text-gray-700 p-2">
                  <Edit2 className="w-5 h-5" />
                </button>
              </div>

              {/* Contact Information Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="flex items-center space-x-2.5">
                  <span className="text-gray-400 text-base">✉️</span>
                  <span className="text-gray-700">
                    anhlqde180272@fpt.edu.vn
                  </span>
                </div>
                <div className="flex items-center space-x-2.5">
                  <span className="text-gray-400 text-base">📱</span>
                  <span className="text-gray-400">Your phone number</span>
                </div>
                <div className="flex items-center space-x-2.5">
                  <span className="text-gray-400 text-base">📅</span>
                  <span className="text-gray-400">Your date of birth</span>
                </div>
                <div className="flex items-center space-x-2.5">
                  <span className="text-gray-400 text-base">⚧</span>
                  <span className="text-gray-400">Your gender</span>
                </div>
                <div className="flex items-center space-x-2.5">
                  <span className="text-gray-400 text-base">📍</span>
                  <span className="text-gray-400">Your current address</span>
                </div>
                <div className="flex items-center space-x-2.5">
                  <span className="text-gray-400 text-base">🔗</span>
                  <span className="text-gray-400">Your personal link</span>
                </div>
              </div>
            </div>

            {/* About Me */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  About Me
                </h2>
                <button className="text-gray-600 hover:text-gray-700 p-2">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <p className="text-gray-400 text-sm italic">
                Introduce your strengths and years of experience
              </p>
            </div>

            {/* Education */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Education
                </h2>
                <button className="text-gray-600 hover:text-gray-700 p-2">
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-base mb-1">
                      FPT University
                    </h3>
                    <p className="text-sm text-gray-600 mb-1">
                      Bachelor - Kỹ thuật phần mềm
                    </p>
                    <p className="text-sm text-gray-500">10/2022 - NOW</p>
                  </div>
                  <div className="flex space-x-1">
                    <button className="text-gray-500 hover:text-gray-600 p-1.5">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button className="text-gray-500 hover:text-gray-600 p-1.5">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Work Experience */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Work Experience
                </h2>
                <button className="text-gray-600 hover:text-gray-700 p-2">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <p className="text-gray-400 text-sm italic">
                Highlight detailed information about your job history
              </p>
            </div>

            {/* Skills */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Skills</h2>
                <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                  <PopoverTrigger asChild>
                    <button
                      className="text-gray-600 hover:text-gray-700 p-2"
                      onClick={() => setPopoverOpen(true)}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent>
                    <div className="font-semibold text-gray-700 mb-2">Add group:</div>
                    <button
                      className="flex items-center w-full py-2 px-3 rounded hover:bg-gray-100 text-left text-gray-900 gap-2"
                      onClick={() => {
                        setSkillType("core");
                        setPopoverOpen(false);
                        setIsSkillDialogOpen(true);
                      }}
                    >
                      <Plus className="w-4 h-4 text-red-500" />
                      Core skills
                    </button>
                    <button
                      className="flex items-center w-full py-2 px-3 rounded hover:bg-gray-100 text-left text-gray-900 gap-2"
                      onClick={() => {
                        setSkillType("soft");
                        setPopoverOpen(false);
                        setIsSkillDialogOpen(true);
                      }}
                    >
                      <Plus className="w-4 h-4 text-red-500" />
                      Soft skills
                    </button>
                  </PopoverContent>
                </Popover>
              </div>
              <p className="text-gray-400 text-sm italic">
                Showcase your skills and proficiencies
              </p>
              {/* Hiển thị dữ liệu đã lưu */}
              {(coreSkillGroups.length > 0 || softSkillItems.length > 0) && (
                <div className="mt-4 space-y-4">
                  {coreSkillGroups.map((group) => (
                    <div key={group.id} className="space-y-2">
                      <div className="font-semibold text-gray-900">{group.name}</div>
                      <div className="flex flex-wrap gap-2">
                        {group.items.map((item) => (
                          <div
                            key={item.id}
                            className="inline-flex items-center rounded-full border bg-white px-3 py-1 text-sm font-medium text-gray-900 shadow-sm gap-2"
                            style={{ borderColor: '#e5e7eb' }}
                          >
                            <span>{item.skill}</span>
                            {item.experience && (
                              <span className="text-gray-500">({item.experience})</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  {softSkillItems.length > 0 && (
                    <div className="space-y-2">
                      <div className="font-semibold text-gray-900">Soft Skills</div>
                      <div className="flex flex-wrap gap-2">
                        {softSkillItems.map((item) => (
                          <div
                            key={item.id}
                            className="inline-flex items-center rounded-full border bg-white px-3 py-1 text-sm font-medium text-gray-900 shadow-sm gap-2"
                            style={{ borderColor: '#e5e7eb' }}
                          >
                            <span>{item.skill}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Foreign Language */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Foreign Language
                </h2>
                <button className="text-gray-600 hover:text-gray-700 p-2">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <p className="text-gray-400 text-sm italic">
                Provide your language skills and proficiencies
              </p>
            </div>

            {/* Highlight Project */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Highlight Project
                </h2>
                <button className="text-gray-600 hover:text-gray-700 p-2">
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-base mb-1">
                      FB
                    </h3>
                    <p className="text-sm text-gray-500">03/2022 - NOW</p>
                  </div>
                  <div className="flex space-x-1">
                    <button className="text-gray-500 hover:text-gray-600 p-1.5">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button className="text-gray-500 hover:text-gray-600 p-1.5">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Certificates */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Certificates
                </h2>
                <button
                  className="text-gray-600 hover:text-gray-700 p-2"
                  onClick={() => setIsCertDialogOpen(true)}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <p className="text-gray-400 text-sm italic">
                Provides evidence of your specific expertise and skills
              </p>
              {certificates.length > 0 && (
                <ul className="mt-4 space-y-2">
                  {certificates.map((c) => (
                    <li key={c.id} className="border rounded-lg p-3">
                      <div className="font-medium text-gray-900">{c.name}</div>
                      <div className="text-sm text-gray-500">
                        {c.org} • {c.month}/{c.year}
                      </div>
                      {c.url && (
                        <a href={c.url} target="_blank" className="text-sm text-blue-600">{c.url}</a>
                      )}
                      {c.desc && (
                        <p className="text-sm text-gray-700 mt-1">{c.desc}</p>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Awards */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Awards</h2>
                <button className="text-gray-600 hover:text-gray-700 p-2">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <p className="text-gray-400 text-sm italic">
                Highlight your awards or recognitions
              </p>
            </div>
          </section>

          {/* Right Sidebar - Profile Strength */}
          <aside className="hidden xl:block space-y-6 sticky [top:calc(var(--sticky-offset)+var(--content-pad))] self-start transition-all duration-300">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-base font-semibold text-gray-900 mb-5">
                Profile Strength
              </h3>
              {/* Progress Circle */}
              <div className="flex justify-center mb-6">
                <div className="relative w-36 h-36">
                  <svg className="w-36 h-36 transform -rotate-90">
                    <circle
                      cx="72"
                      cy="72"
                      r="64"
                      stroke="#fee2e2"
                      strokeWidth="14"
                      fill="none"
                    />
                    <circle
                      cx="72"
                      cy="72"
                      r="64"
                      stroke="#ef4444"
                      strokeWidth="14"
                      fill="none"
                      strokeDasharray={`${64 * 2 * Math.PI * 0.2} ${
                        64 * 2 * Math.PI
                      }`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-gray-900">
                        {profileCompletion}%
                      </div>
                      <div className="text-sm text-gray-500">completed</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Chat bubble for complete profile */}
              <div className="relative mb-6 mr-10">
                <div className="bg-white border border-gray-300 shadow-sm rounded-2xl px-4 py-3 text-gray-700 text-sm leading-relaxed">
                  Complete profile to{" "}
                  <span className="text-gray-500 font-semibold">70%</span> to
                  generate CV template for IT professionals.
                </div>
                {/* Đuôi bong bóng */}
                <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-t border-r border-gray-300 rotate-45"></div>
                {/* Icon robot */}
                <div className="absolute -right-10 top-1/2 -translate-y-1/2">
                  <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center text-xl">
                    🤖
                  </div>
                </div>
              </div>

              {/* Action Items */}
              <div className="space-y-2 mb-6">
                <button className="w-full text-left flex items-center space-x-2 text-blue-600 hover:text-blue-700 text-sm font-medium">
                  <Plus className="w-4 h-4" />
                  <span>Add About me</span>
                </button>
                <button className="w-full text-left flex items-center space-x-2 text-blue-600 hover:text-blue-700 text-sm font-medium">
                  <Plus className="w-4 h-4" />
                  <span>Add Contact Information</span>
                </button>
                <button className="w-full text-left flex items-center space-x-2 text-blue-600 hover:text-blue-700 text-sm font-medium">
                  <Plus className="w-4 h-4" />
                  <span>Add Work Experience</span>
                </button>

                <button
                  onClick={() => toggleSection("more")}
                  className="w-full flex items-center justify-between text-sm text-gray-600 hover:text-gray-800 font-medium pt-2"
                >
                  <span>Add more information</span>
                  {expandedSections.includes("more") ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>

                {expandedSections.includes("more") && (
                  <div className="pl-4 space-y-2 text-sm text-gray-600">
                    <p>• Add Skills</p>
                    <p>• Add Languages</p>
                    <p>• Add Projects</p>np
                    <p>• Add Certificates</p>
                  </div>
                )}
              </div>

              {/* Preview & Download Button */}
              <button className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors">
                Preview & Download CV
              </button>
            </div>
          </aside>
        </div>
      </main>

      {/* Skills Dialog */}
      <Dialog open={isSkillDialogOpen} onOpenChange={setIsSkillDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              {skillType === "core" && "Core Skills"}
              {skillType === "soft" && "Soft Skills"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Tip */}
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 flex items-start space-x-2">
              <span className="text-orange-600 text-lg">💡</span>
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Tips:</span> Organize your core skills into groups helps recruiters quickly understand your professional capabilities.
              </p>
            </div>

            {/* Skill Type */}
            <div className="space-y-2">
              <Label htmlFor="skillType" className="text-sm font-medium text-gray-700">
                Skill Type <span className="text-red-500">*</span>
              </Label>
              <Select value={skillType} onValueChange={setSkillType}>
                <SelectTrigger id="skillType" className="w-full">
                  <SelectValue placeholder="Select skill type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="core">Core Skills</SelectItem>
                  <SelectItem value="soft">Soft Skills</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Group Name (only for core skills) */}
            {skillType === "core" && (
              <div className="space-y-2">
                <Label htmlFor="groupName" className="text-sm font-medium text-gray-700">
                  Group name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="groupName"
                  type="text"
                  placeholder="e.g., Core Skills, Programming Languages"
                  value={skillGroupName}
                  onChange={(e) => setSkillGroupName(e.target.value)}
                  className="w-full"
                />
              </div>
            )}

            {/* List Skills */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                List skills ({skills.length}/20)
              </Label>
              
              <div className="flex space-x-2">
                <Input
                  placeholder="Enter skill"
                  value={selectedSkill}
                  onChange={e => setSelectedSkill(e.target.value)}
                  className="flex-1"
                />
                {skillType === "core" && (
                  <Select value={skillExperience} onValueChange={setSkillExperience}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Select experience" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1 year">1 year</SelectItem>
                      <SelectItem value="2 years">2 years</SelectItem>
                      <SelectItem value="3 years">3 years</SelectItem>
                      <SelectItem value="5 years">5 years</SelectItem>
                      <SelectItem value="10 years">10 years</SelectItem>
                    </SelectContent>
                  </Select>
                )}
                <Button
                  onClick={handleAddSkill}
                  disabled={
                    !selectedSkill || (skillType === "core" && !skillExperience)
                  }
                  className="bg-red-500 hover:bg-red-600 text-white px-4"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              {/* Skills List dạng chip */}
              <div className="flex flex-wrap gap-2 mt-2">
                {skills.map(skill => (
                  <div
                    key={skill.id}
                    className="inline-flex items-center rounded-full border bg-white px-3 py-1 text-sm font-medium text-gray-900 shadow-sm gap-2"
                    style={{ borderColor: '#e5e7eb' }}
                  >
                    <span>{skill.skill}</span>
                    {skill.experience && (
                      <span className="text-gray-500">({skill.experience})</span>
                    )}
                    <button
                      className="ml-1 text-gray-400 hover:text-red-500"
                      onClick={() => handleRemoveSkill(skill.id)}
                      type="button"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={handleCancelSkills}
              className="px-6"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveSkills}
              disabled={
                !skillType ||
                skills.length === 0 ||
                (skillType === "core" && !skillGroupName)
              }
              className="bg-gray-700 hover:bg-gray-800 text-white px-6"
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Certificates Dialog */}
      <Dialog open={isCertDialogOpen} onOpenChange={setIsCertDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Certificates</DialogTitle>
          </DialogHeader>

          <div className="space-y-5 py-2">
            <div className="space-y-2">
              <Label>Certificate Name <span className="text-red-500">*</span></Label>
              <Input value={certName} onChange={(e) => setCertName(e.target.value)} placeholder="e.g., AWS Certified Solutions Architect" />
            </div>
            <div className="space-y-2">
              <Label>Organization <span className="text-red-500">*</span></Label>
              <Input value={certOrg} onChange={(e) => setCertOrg(e.target.value)} placeholder="e.g., Amazon Web Services" />
            </div>
            <div className="space-y-2">
              <Label>Issue date <span className="text-red-500">*</span></Label>
              <div className="flex gap-2">
                <Select value={certMonth} onValueChange={setCertMonth}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Month" />
                  </SelectTrigger>
                  <SelectContent>
                    {[
                      "01","02","03","04","05","06","07","08","09","10","11","12",
                    ].map((m) => (
                      <SelectItem key={m} value={m}>{m}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={certYear} onValueChange={setCertYear}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 31 }).map((_, idx) => {
                      const y = String(2025 - idx);
                      return <SelectItem key={y} value={y}>{y}</SelectItem>;
                    })}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Certificate URL</Label>
              <Input value={certUrl} onChange={(e) => setCertUrl(e.target.value)} placeholder="https://..." />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea value={certDesc} onChange={(e) => setCertDesc(e.target.value)} rows={5} placeholder="Optional description..." />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsCertDialogOpen(false)}>Cancel</Button>
            <Button
              className="bg-gray-700 hover:bg-gray-800 text-white"
              disabled={!certName || !certOrg || !certMonth || !certYear || isCertSaving}
              onClick={async () => {
                try {
                  setIsCertSaving(true);
                  const day = "01"; // Using first day of the month by default
                  const payload = {
                    name: certName.trim(),
                    organization: certOrg.trim(),
                    getDate: `${certYear}-${certMonth}-${day}`,
                    certificateUrl: certUrl.trim() || undefined,
                    description: certDesc.trim() || undefined,
                  };

                  const res = await api.post("/api/certificate", payload);

                  // Try to extract from common shapes
                  const result = res?.data?.result || res?.data || payload;

                  // Update UI list
                  setCertificates((prev) => [
                    ...prev,
                    {
                      id: (result?.id?.toString?.() || Date.now().toString()),
                      name: result?.name || payload.name,
                      org: result?.organization || payload.organization,
                      month: certMonth,
                      year: certYear,
                      url: result?.certificateUrl || payload.certificateUrl,
                      desc: result?.description || payload.description,
                    },
                  ]);

                  toast.success("Certificate added successfully");

                  // Reset form and close
                  setIsCertDialogOpen(false);
                  setCertName("");
                  setCertOrg("");
                  setCertMonth("");
                  setCertYear("");
                  setCertUrl("");
                  setCertDesc("");
                } catch (err: any) {
                  const msg = err?.response?.data?.message || err?.message || "Failed to add certificate";
                  toast.error(msg);
                } finally {
                  setIsCertSaving(false);
                }
              }}
            >
              {isCertSaving ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
