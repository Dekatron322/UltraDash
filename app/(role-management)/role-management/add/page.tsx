"use client"
import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { FiArrowLeft, FiBriefcase, FiCheck, FiHome, FiMail, FiPhone, FiUser } from "react-icons/fi"
import { ButtonModule } from "components/ui/Button/Button"
import { notify } from "components/ui/Notification/Notification"
import DashboardNav from "components/Navbar/DashboardNav"
import { Badge } from "components/ui/Badge/badge"

interface Department {
  id: string
  name: string
}

const AddNewEmployee: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [address, setAddress] = useState("")
  const [department, setDepartment] = useState("")
  const [role, setRole] = useState<"admin" | "manager" | "staff" | "support">("staff")
  const [isValidEmail, setIsValidEmail] = useState(true)
  const [activeField, setActiveField] = useState<
    "firstName" | "lastName" | "email" | "phone" | "address" | "department" | null
  >(null)

  const router = useRouter()

  const departments: Department[] = [
    { id: "1", name: "Engineering" },
    { id: "2", name: "Marketing" },
    { id: "3", name: "Sales" },
    { id: "4", name: "Human Resources" },
    { id: "5", name: "Operations" },
  ]

  const handleGoBack = () => {
    router.back()
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!firstName || !lastName) {
      // notify({
      //   type: "error",
      //   title: "Name Required",
      //   message: "Please enter both first and last name",
      // })
      return
    }

    if (!email) {
      // notify({
      //   type: "error",
      //   title: "Email Required",
      //   message: "Please enter an email address",
      // })
      return
    }

    if (!isValidEmail) {
      // notify({
      //   type: "error",
      //   title: "Invalid Email",
      //   message: "Please enter a valid email address",
      // })
      return
    }

    if (!department) {
      // notify({
      //   type: "error",
      //   title: "Department Required",
      //   message: "Please select a department",
      // })
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const newEmployee = {
        firstName,
        lastName,
        email,
        phone,
        address,
        department,
        role,
        status: "active" as const,
        joinDate: new Date().toISOString(),
      }

      // notify({
      //   type: "success",
      //   title: "Employee Added!",
      //   message: `${firstName} ${lastName} has been added to ${department}`,
      //   duration: 2000,
      // })

      setTimeout(() => router.push("/employees"), 1000)
    } catch (error: any) {
      setError(error.message || "Employee creation failed. Please try again.")
      // notify({
      //   type: "error",
      //   title: "Creation Failed",
      //   message: error.message || "Please try again",
      // })
    } finally {
      setLoading(false)
    }
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setEmail(value)
    setIsValidEmail(validateEmail(value))
  }

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }

  const getRoleBadge = (role: string) => {
    switch (role.toLowerCase()) {
      case "admin":
        return <Badge variant="destructive">Admin</Badge>
      case "manager":
        return <Badge variant="outline">Manager</Badge>
      case "staff":
        return <Badge variant="secondary">Staff</Badge>
      case "support":
        return <Badge variant="default">Support</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <DashboardNav />

      <div className="container mx-auto max-w-md px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          {/* Header */}
          <div className="mb-8 flex items-center">
            <button onClick={handleGoBack} className="mr-4 rounded-full p-2 hover:bg-gray-100">
              <FiArrowLeft className="size-5 text-gray-700" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Add New Employee</h1>
              <p className="text-gray-500">Add a new employee to your organization</p>
            </div>
          </div>

          {/* Employee Form */}
          <form onSubmit={handleSubmit}>
            {/* Name Fields */}
            <div className="mb-6 grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">First Name</label>
                <div
                  className={`relative rounded-xl border p-3 transition-all ${
                    activeField === "firstName"
                      ? "border-blue-500 bg-white ring-2 ring-blue-200"
                      : "border-gray-200 bg-gray-50"
                  }`}
                  onClick={() => setActiveField("firstName")}
                >
                  <div className="flex items-center">
                    <FiUser className={`mr-2 text-gray-400 ${activeField === "firstName" ? "text-blue-500" : ""}`} />
                    <input
                      type="text"
                      placeholder="John"
                      className="flex-1 bg-transparent text-gray-800 outline-none placeholder:text-gray-400"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      onFocus={() => setActiveField("firstName")}
                      onBlur={() => setActiveField(null)}
                      required
                    />
                  </div>
                </div>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Last Name</label>
                <div
                  className={`relative rounded-xl border p-3 transition-all ${
                    activeField === "lastName"
                      ? "border-blue-500 bg-white ring-2 ring-blue-200"
                      : "border-gray-200 bg-gray-50"
                  }`}
                  onClick={() => setActiveField("lastName")}
                >
                  <div className="flex items-center">
                    <FiUser className={`mr-2 text-gray-400 ${activeField === "lastName" ? "text-blue-500" : ""}`} />
                    <input
                      type="text"
                      placeholder="Doe"
                      className="flex-1 bg-transparent text-gray-800 outline-none placeholder:text-gray-400"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      onFocus={() => setActiveField("lastName")}
                      onBlur={() => setActiveField(null)}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Email Field */}
            <div className="mb-6">
              <label className="mb-2 block text-sm font-medium text-gray-700">Email</label>
              <div
                className={`relative rounded-xl border p-3 transition-all ${
                  activeField === "email"
                    ? "border-blue-500 bg-white ring-2 ring-blue-200"
                    : "border-gray-200 bg-gray-50"
                }`}
                onClick={() => setActiveField("email")}
              >
                <div className="flex items-center">
                  <FiMail className={`mr-2 text-gray-400 ${activeField === "email" ? "text-blue-500" : ""}`} />
                  <input
                    type="email"
                    placeholder="john.doe@company.com"
                    className="flex-1 bg-transparent text-gray-800 outline-none placeholder:text-gray-400"
                    value={email}
                    onChange={handleEmailChange}
                    onFocus={() => setActiveField("email")}
                    onBlur={() => setActiveField(null)}
                    required
                  />
                </div>
                {!isValidEmail && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-1 text-xs text-red-500"
                  >
                    Please enter a valid email
                  </motion.p>
                )}
              </div>
            </div>

            {/* Phone Field */}
            <div className="mb-6">
              <label className="mb-2 block text-sm font-medium text-gray-700">Phone (Optional)</label>
              <div
                className={`relative rounded-xl border p-3 transition-all ${
                  activeField === "phone"
                    ? "border-blue-500 bg-white ring-2 ring-blue-200"
                    : "border-gray-200 bg-gray-50"
                }`}
                onClick={() => setActiveField("phone")}
              >
                <div className="flex items-center">
                  <FiPhone className={`mr-2 text-gray-400 ${activeField === "phone" ? "text-blue-500" : ""}`} />
                  <input
                    type="tel"
                    placeholder="(123) 456-7890"
                    className="flex-1 bg-transparent text-gray-800 outline-none placeholder:text-gray-400"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    onFocus={() => setActiveField("phone")}
                    onBlur={() => setActiveField(null)}
                  />
                </div>
              </div>
            </div>

            {/* Address Field */}
            <div className="mb-6">
              <label className="mb-2 block text-sm font-medium text-gray-700">Address (Optional)</label>
              <div
                className={`relative rounded-xl border p-3 transition-all ${
                  activeField === "address"
                    ? "border-blue-500 bg-white ring-2 ring-blue-200"
                    : "border-gray-200 bg-gray-50"
                }`}
                onClick={() => setActiveField("address")}
              >
                <div className="flex items-center">
                  <FiHome className={`mr-2 text-gray-400 ${activeField === "address" ? "text-blue-500" : ""}`} />
                  <input
                    type="text"
                    placeholder="123 Main St, City, State"
                    className="flex-1 bg-transparent text-gray-800 outline-none placeholder:text-gray-400"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    onFocus={() => setActiveField("address")}
                    onBlur={() => setActiveField(null)}
                  />
                </div>
              </div>
            </div>

            {/* Department Field */}
            <div className="mb-6">
              <label className="mb-2 block text-sm font-medium text-gray-700">Department</label>
              <div
                className={`relative rounded-xl border p-3 transition-all ${
                  activeField === "department"
                    ? "border-blue-500 bg-white ring-2 ring-blue-200"
                    : "border-gray-200 bg-gray-50"
                }`}
                onClick={() => setActiveField("department")}
              >
                <div className="flex items-center">
                  <FiBriefcase
                    className={`mr-2 text-gray-400 ${activeField === "department" ? "text-blue-500" : ""}`}
                  />
                  <select
                    className="flex-1 bg-transparent text-gray-800 outline-none"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    onFocus={() => setActiveField("department")}
                    onBlur={() => setActiveField(null)}
                    required
                  >
                    <option value="">Select a department</option>
                    {departments.map((dept) => (
                      <option key={dept.id} value={dept.id}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Role Selection */}
            <div className="mb-6">
              <label className="mb-2 block text-sm font-medium text-gray-700">Role</label>
              <div className="flex flex-wrap gap-2">
                {(["admin", "manager", "staff", "support"] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    className={`flex items-center rounded-full px-4 py-2 text-sm transition-colors ${
                      role === r ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                    onClick={() => setRole(r)}
                  >
                    {role === r && <FiCheck className="mr-1" />}
                    {getRoleBadge(r)}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <ButtonModule
                type="submit"
                variant="primary"
                size="lg"
                disabled={loading || !firstName || !lastName || !email || !isValidEmail || !department}
                className="w-full"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="mr-2 size-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Adding...
                  </div>
                ) : (
                  "Add Employee"
                )}
              </ButtonModule>

              <ButtonModule type="button" variant="outline" size="lg" className="w-full" onClick={handleGoBack}>
                Cancel
              </ButtonModule>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  )
}

export default AddNewEmployee
