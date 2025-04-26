import React, { useState } from "react";
import XSvg from "../../../components/svg/X";
import { MdOutlineMail } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { MdPassword } from "react-icons/md";
import { MdOutlineDriveFileRenameOutline } from "react-icons/md";
import { Link } from "react-router-dom";

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    fullName: "",
    password: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const isError = false;
  return (
    <div className="max-w-screen-xl mx-auto flex h-screen px-10">
      <div className="flex-1  lg:flex items-center justify-center">
        <XSvg className="lg:w-2/3"></XSvg>
      </div>
      <div className="flex flex-1 flex-col justify-center items-center">
        <form
          className="lg:w-2/3 mx-auto md:mx-20 flex gap-4 flex-col"
          onSubmit={handleSubmit}
        >
          <XSvg className="w-24 lg:hidden"></XSvg>
          <h1 className="text-4xl font-extrabold text-white">Join today.</h1>
          <label className="input input-bordered rounded flex items-center gap-2">
            <MdOutlineMail />
            <input
              type="email"
              className="grow"
              placeholder="Email"
              name="email"
              onChange={handleInputChange}
              value={formData.email}
            />
          </label>
          <div className="flex gap-4 flex-wrap">
            <label className="input input-borderd rounded flex items-center gap-2 flex-1 ">
              <FaUser></FaUser>
              <input
                type="text"
                name="username"
                className="grow"
                placeholder="Username"
                onChange={handleInputChange}
                value={formData.username}
              />
            </label>
            <label className="input input-bordered rounded flex items-center gap-2 flex-1">
              <MdOutlineDriveFileRenameOutline></MdOutlineDriveFileRenameOutline>
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                className="grow"
                onChange={handleInputChange}
                value={formData.fullName}
              />
            </label>
          </div>
          <label className="input input-bordered rounded flex items-center gap-2 ">
            <MdPassword></MdPassword>
            <input
              type="text"
              name="password"
              placeholder="Password"
              className="grow"
              onChange={handleInputChange}
              value={formData.password}
            />
          </label>

          <button className="btn rounded-full btn-primary text-white">
            Sign Up
          </button>
          {isError && <p className="text-red-500">Something went wrong</p>}
        </form>
        <div className="flex flex-col lg:w-2/3 gap-2 mt-4">
          <p className="text-white text-lg">Already have an account ?</p>
          <Link to={"/login"}>
            <button className="btn rounded-full btn-primary text-white btn-outline w-full">
              Sign in
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
