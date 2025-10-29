import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface PersonalDetailDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    profileName: string;
    profileTitle: string;
    profilePhone: string;
    profileDob: string;
    profileGender: string;
    profileAddress: string;
    profileLink: string;
    profileImage: string;
    onProfileNameChange: (value: string) => void;
    onProfileTitleChange: (value: string) => void;
    onProfilePhoneChange: (value: string) => void;
    onProfileDobChange: (value: string) => void;
    onProfileGenderChange: (value: string) => void;
    onProfileAddressChange: (value: string) => void;
    onProfileLinkChange: (value: string) => void;
    onProfileImageChange: (value: string) => void;
    onSave: () => void;
}

export default function PersonalDetailDialog({
    open,
    onOpenChange,
    profileName,
    profileTitle,
    profilePhone,
    profileDob,
    profileGender,
    profileAddress,
    profileLink,
    profileImage,
    onProfileNameChange,
    onProfileTitleChange,
    onProfilePhoneChange,
    onProfileDobChange,
    onProfileGenderChange,
    onProfileAddressChange,
    onProfileLinkChange,
    onProfileImageChange,
    onSave
}: PersonalDetailDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl bg-white">
                <DialogHeader>
                    <DialogTitle>Personal Details</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Full Name <span className="text-red-500">*</span>
                            </label>
                            <Input
                                value={profileName}
                                onChange={(e) => onProfileNameChange(e.target.value)}
                                placeholder="Enter your full name"
                            />
                        </div>

                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Professional Title
                            </label>
                            <Input
                                value={profileTitle}
                                onChange={(e) => onProfileTitleChange(e.target.value)}
                                placeholder="e.g., Software Engineer, Data Analyst"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Phone Number
                            </label>
                            <Input
                                value={profilePhone}
                                onChange={(e) => onProfilePhoneChange(e.target.value)}
                                placeholder="Enter your phone number"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Date of Birth
                            </label>
                            <Input
                                type="date"
                                value={profileDob}
                                onChange={(e) => onProfileDobChange(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Gender
                            </label>
                            <select
                                value={profileGender}
                                onChange={(e) => onProfileGenderChange(e.target.value)}
                                className="w-full h-10 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                            >
                                <option value="">Select gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Profile Image URL
                            </label>
                            <Input
                                value={profileImage}
                                onChange={(e) => onProfileImageChange(e.target.value)}
                                placeholder="https://example.com/image.jpg"
                            />
                        </div>

                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Address <span className="text-red-500">*</span>
                            </label>
                            <Input
                                value={profileAddress}
                                onChange={(e) => onProfileAddressChange(e.target.value)}
                                placeholder="Enter your address"
                            />
                        </div>

                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Personal Link (Portfolio/LinkedIn)
                            </label>
                            <Input
                                value={profileLink}
                                onChange={(e) => onProfileLinkChange(e.target.value)}
                                placeholder="https://linkedin.com/in/yourprofile"
                            />
                        </div>
                    </div>
                </div>

                <DialogFooter className="gap-2">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button
                        onClick={onSave}
                        className="bg-red-500 hover:bg-red-600 text-white"
                    >
                        Save
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
