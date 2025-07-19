"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"
import { Edit, Plus, Trash2 } from "lucide-react"

interface Location {
  id: number
  name: string
  address: string
  city: string
}

interface AdminLocationsProps {
  locations: Location[]
  setLocations: React.Dispatch<React.SetStateAction<Location[]>>
}

export default function AdminLocations({ locations, setLocations }: AdminLocationsProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
  })

  const { toast } = useToast()

  const resetForm = () => {
    setFormData({
      name: "",
      address: "",
      city: "",
    })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleAddLocation = async () => {
    if (!formData.name || !formData.address || !formData.city) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }
    setIsLoading(true)
    try {
      const response = await fetch("/api/locations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "add", ...formData }),
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to add location")
      }
      const newLocation = await response.json()
      setLocations((prev) => [...prev, newLocation])
      toast({
        title: "Location added",
        description: "The location has been added successfully",
      })
      setIsAddDialogOpen(false)
      resetForm()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const openEditDialog = (location: Location) => {
    setSelectedLocation(location)
    setFormData({
      name: location.name,
      address: location.address,
      city: location.city,
    })
    setIsEditDialogOpen(true)
  }

  const handleEditLocation = async () => {
    if (!selectedLocation) return
    if (!formData.name || !formData.address || !formData.city) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }
    setIsLoading(true)
    try {
      const response = await fetch("/api/locations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "update", id: selectedLocation.id, ...formData }),
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to update location")
      }
      const updatedLocation = await response.json()
      setLocations((prev) =>
        prev.map((loc) => (loc.id === updatedLocation.id ? updatedLocation : loc))
      )
      toast({
        title: "Location updated",
        description: "The location has been updated successfully",
      })
      setIsEditDialogOpen(false)
      setSelectedLocation(null)
      resetForm()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const openDeleteDialog = (location: Location) => {
    setSelectedLocation(location)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteLocation = async () => {
    if (!selectedLocation) return
    setIsLoading(true)
    try {
      const response = await fetch("/api/locations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete", id: selectedLocation.id }),
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to delete location")
      }
      setLocations((prev) => prev.filter((loc) => loc.id !== selectedLocation.id))
      toast({
        title: "Location deleted",
        description: "The location has been deleted successfully",
      })
      setIsDeleteDialogOpen(false)
      setSelectedLocation(null)
      resetForm()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Manage Locations</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-red-600 hover:bg-red-700">
              <Plus className="mr-2 h-4 w-4" />
              Add Location
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Location</DialogTitle>
              <DialogDescription>Enter the details of the new location</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" value={formData.name} onChange={handleInputChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" name="address" value={formData.address} onChange={handleInputChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input id="city" name="city" value={formData.city} onChange={handleInputChange} required />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button className="bg-red-600 hover:bg-red-700" onClick={handleAddLocation} disabled={isLoading}>
                {isLoading ? "Adding..." : "Add Location"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>City</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {locations.map((location) => (
            <TableRow key={location.id}>
              <TableCell>{location.name}</TableCell>
              <TableCell>{location.address}</TableCell>
              <TableCell>{location.city}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  <Button variant="ghost" size="icon" onClick={() => openEditDialog(location)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => openDeleteDialog(location)}>
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Location</DialogTitle>
            <DialogDescription>Update the details of the location</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input id="edit-name" name="name" value={formData.name} onChange={handleInputChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-address">Address</Label>
              <Input id="edit-address" name="address" value={formData.address} onChange={handleInputChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-city">City</Label>
              <Input id="edit-city" name="city" value={formData.city} onChange={handleInputChange} required />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-red-600 hover:bg-red-700" onClick={handleEditLocation} disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Location"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Location</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this location? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {selectedLocation && (
            <div className="py-4">
              <p className="font-medium">{selectedLocation.name}</p>
              <p>{selectedLocation.address}, {selectedLocation.city}</p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteLocation} disabled={isLoading}>
              {isLoading ? "Deleting..." : "Delete Location"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
