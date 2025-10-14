import { useState } from "react";
import {
    FaUser,
    FaUsers,
    FaListAlt,
    FaCreditCard,
    FaLock,
    FaHeadset,
    FaSignOutAlt,
} from "react-icons/fa";
import { BiEditAlt } from "react-icons/bi";
import { RxCross2 } from "react-icons/rx";
import { MdDelete, MdPhotoCamera } from "react-icons/md";

function Myaccount() {
    const [editMode, setEditMode] = useState(false);

    return (
        <div className="bg-gray-100 py-10">
            <div className="w-full max-w-6xl mx-auto flex gap-8 items-start">
                {/* Sidebar */}
                <aside className="w-64 bg-white shadow-md p-6 rounded-lg">
                    <nav className="space-y-3">
                        <SidebarItem icon={<FaUser />} label="My Account" active />
                        <SidebarItem icon={<FaUsers />} label="Travellers" />
                        <SidebarItem icon={<FaListAlt />} label="My Bookings" />
                        <SidebarItem icon={<FaCreditCard />} label="Saved Cards" />
                        <SidebarItem icon={<FaLock />} label="Change Password" />
                        <SidebarItem icon={<FaHeadset />} label="Support" />
                        <SidebarItem icon={<FaSignOutAlt />} label="Logout" />
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="flex-1">
                    <h1 className="text-xl font-semibold mb-6">User Profile</h1>

                    {!editMode ? (
                        <ProfileView onEdit={() => setEditMode(true)} />
                    ) : (
                        <EditProfileForm onCancel={() => setEditMode(false)} />
                    )}
                </main>
            </div>
        </div>
    );
}

function SidebarItem({ icon, label, active }) {
    return (
        <div
            className={`flex items-center gap-3 p-2 rounded-md cursor-pointer ${active
                ? "bg-red-50 text-red-600 font-semibold"
                : "hover:bg-gray-50 text-gray-700"
                }`}
        >
            <span className="text-lg">{icon}</span>
            <span>{label}</span>
        </div>
    );
}

function ProfileView({ onEdit }) {
    return (
        <div className="bg-white shadow rounded-lg p-6 w-full max-w-3xl">
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-4">
                    <img
                        src="https://i.ibb.co.com/GQYBv31w/Des3.png"
                        alt="Profile"
                        className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md"
                    />
                    <div>
                        <h2 className="text-lg font-bold">Shormily Raisa</h2>
                    </div>
                </div>

                <button
                    onClick={onEdit}
                    className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 font-semibold rounded-md "
                >
                    <BiEditAlt size={20} /> Edit Profile
                </button>
            </div>

            <hr className="border border-gray-200 mb-6" />
            {/* need to to value="N/A" descirse gap same as picture  */}
            <div className="flex gap-44">
                <div>
                    <h1 className="text-lg font-bold mb-3">Personal Information</h1>
                    <ProfileRow label="Full Name" value="N/A" />
                    <ProfileRow label="Gender" value="N/A" />
                    <ProfileRow label="Date of Birth" value="N/A" />
                    <ProfileRow label="Nationality" value="N/A" />
                    <ProfileRow label="Marital Status" value="N/A" />
                    <ProfileRow label="Religion" value="N/A" />
                    <ProfileRow label="Present Address" value="N/A" />
                    <ProfileRow label="Permanent Address" value="N/A" />
                </div>

                <div className="">
                    <h1 className="text-lg font-bold mb-3">Contact Info</h1>
                    <ProfileRow label="Mobile Number" value="N/A" />
                    <ProfileRow label="Email" value="N/A" />
                    <ProfileRow label="Passport Number" value="N/A" />
                    <ProfileRow label="Passport Expiry Date" value="N/A" />
                    <ProfileRow label="Passport Image" value="N/A" />
                </div>
            </div>
        </div>
    );
}

function ProfileRow({ label, value }) {
    return (
        <div className="flex justify-between gap-8  py-2">
            <p className="text-gray-500">{label}</p>
            <p className="font-medium text-gray-800">{value}</p>
        </div>
    );
}

function EditProfileForm({ onCancel }) {
    return (
        <div className="bg-white shadow rounded-lg p-6 w-full max-w-3xl">
            {/* Header */}
             <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-4">
                    <img
                        src="https://i.ibb.co.com/GQYBv31w/Des3.png"
                        alt="Profile"
                        className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md"
                    />
                    
                    <div>
                        <h2 className="text-lg font-bold">Shormily Raisa</h2>
                    </div>
                </div>

                <button
                    onClick={onCancel}
                    className="mt-2 px-4 gap-1 p-2 text-sm bg-red-50 text-red-700 font-bold rounded-md justify-end flex"
                >
                    <RxCross2 className="bg-red-600 text-white rounded-full w-3 h-3 mt-1" size={21} />  <span className="">Edit Profile</span>
                </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <Input label="First Name" />
                <Input label="Last Name" />
                <Input label="Email Address" />
                <Input label="Contact Number" />

                <div className="flex flex-col">
                    <label className="text-md font-semibold mb-1">Gender</label>
                    <select className="border border-gray-300 rounded-md p-3 text-sm outline-none">
                        <option value="">Select Gender</option>
                        <option>Male</option>
                        <option>Female</option>
                    </select>
                </div>

                <Input label="Date of Birth" type="date" />

                <div className="flex flex-col col-span-2">
                    <label className="text-md font-semibold mb-1">Nationality</label>
                    <select className="border border-gray-300 rounded-md p-3 text-sm outline-none w-full">
                        <option value="">Select Nationality</option>
                        <option>Bangladeshi</option>
                        <option>Indian</option>
                        <option>Pakistani</option>
                        <option>Nepalese</option>
                    </select>
                </div>
                <div className="grid grid-cols-2 gap-4">

                </div>
                <div className="col-span-2 grid grid-cols-2 gap-4">
                    <Textarea label="Present Address" placeholder="Enter present address" />
                    <Textarea label="Permanent Address" placeholder="Enter permanent address" />
                </div>
                <div className="flex flex-col">
                    <label className="text-md font-semibold mb-1">Marital Status</label>
                    <select className="border border-gray-300 rounded-md p-3 text-sm outline-none">
                        <option value="">Select</option>
                        <option>Single</option>
                        <option>Married</option>
                        <option>Divorced</option>
                    </select>
                </div>

                <div className="flex flex-col">
                    <label className="text-md font-semibold mb-1">Religion</label>
                    <select className="border border-gray-300 rounded-md p-3 text-sm outline-none">
                        <option value="">Select Religion</option>
                        <option>Islam</option>
                        <option>Hinduism</option>
                        <option>Christianity</option>
                        <option>Buddhism</option>
                    </select>
                </div>

                <Input label="Passport Number" />
                <Input label="Passport Expiry Date" type="date" />
                {/* I want to click this time uplod photo i want see in my file  */}
                <div className="col-span-2">
                    <label className="text-md font-semibold mb-1">
                        Upload Passport’s Front Page
                    </label>
                    <div className="border border-dashed border-gray-400 rounded-md p-6 text-center cursor-pointer hover:bg-gray-50">
                        <p className="text-gray-600">Click to upload photo</p>
                    </div>
                </div>
            </div>

            <div className="flex justify-end mt-6 gap-3">
                <button
                    onClick={onCancel}
                    className="px-6 py-2 rounded-md bg-red-100 text-red-700 font-semibold"
                >
                    Cancel
                </button>
                <button className="px-6 py-2 rounded-md bg-red-700 text-white font-semibold">
                    Save
                </button>
            </div>
        </div>
    );
}
function Textarea({ label, placeholder }) {
    return (
        <div className="flex flex-col">
            <label className="text-md font-semibold mb-1">{label}</label>
            <textarea
                placeholder={placeholder}
                className="border border-gray-300 rounded-md p-3 text-sm outline-none h-24"
            />
        </div>
    );
}

function Input({ label, type = "text" }) {
    return (
        <div className="flex flex-col">
            <label className="text-md font-semibold mb-1">{label}</label>
            <input
                type={type}
                className="border border-gray-300 rounded-md p-3 text-sm outline-none"
            />
        </div>
    );
}

export default Myaccount;
