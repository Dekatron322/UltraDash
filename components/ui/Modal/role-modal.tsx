"use client"
import React, { useState, useEffect } from "react"
import { ButtonModule } from "components/ui/Button/Button"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "components/ui/select"
import { Input } from "components/ui/input"
import { Label } from "components/ui/label"
import { Employee } from "app/(role-management)/role-management/page"

const RoleModal = ({
  isOpen,
  onClose,
  employee,
  onSave,
}: {
  isOpen: boolean
  onClose: () => void
  employee: Employee | null
  onSave: (employeeData: Partial<Employee>) => void
}) => {
  const [formData, setFormData] = useState<Partial<Employee>>({
    name: "",
    email: "",
    role: "staff",
    status: "active",
    department: "",
  })

  useEffect(() => {
    if (employee) {
      setFormData({
        name: employee.name,
        email: employee.email,
        role: employee.role,
        status: employee.status,
        department: employee.department,
      })
    } else {
      setFormData({
        name: "",
        email: "",
        role: "staff",
        status: "active",
        department: "",
      })
    }
  }, [employee])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-xl font-semibold">
          {employee ? "Edit Employee Role" : "Add New Employee"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4 space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Employee name"
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="employee@example.com"
                required
              />
            </div>
            <div>
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                placeholder="Department"
                required
              />
            </div>
            <div>
              <Label htmlFor="role">Role</Label>
              <Select
                value={formData.role}
                onValueChange={(value) => handleSelectChange("role", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="staff">Staff</SelectItem>
                  <SelectItem value="support">Support</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleSelectChange("status", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <ButtonModule variant="outline" onClick={onClose}>
              Cancel
            </ButtonModule>
            <ButtonModule variant="primary" type="submit">
              {employee ? "Save Changes" : "Add Employee"}
            </ButtonModule>
          </div>
        </form>
      </div>
    </div>
  )
}

export default RoleModal