
import React, { useState } from 'react';
import DashboardPanel from '../DashboardPanel';
import { UsersRound, Plus, Pencil, Trash2, Check, X } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFleet } from '@/context/FleetContext';
import { Driver } from '@/types/drivers';

const Drivers: React.FC = () => {
  const { drivers, addDriver, updateDriver, deleteDriver } = useFleet();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentDriver, setCurrentDriver] = useState<Driver | null>(null);
  
  // Form state
  const [name, setName] = useState('');
  const [licenseNo, setLicenseNo] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Driver['status']>('pending-approval');
  const [notes, setNotes] = useState('');
  
  const resetForm = () => {
    setName('');
    setLicenseNo('');
    setPhoneNumber('');
    setEmail('');
    setStatus('pending-approval');
    setNotes('');
    setCurrentDriver(null);
  };
  
  const handleAdd = () => {
    const newDriver: Driver = {
      id: `driver-${Date.now()}`,
      name,
      licenseNo,
      phoneNumber,
      email,
      status,
      notes,
      createdAt: new Date().toISOString().split('T')[0]
    };
    
    addDriver(newDriver);
    setIsAddDialogOpen(false);
    resetForm();
  };
  
  const handleEdit = () => {
    if (!currentDriver) return;
    
    const updatedDriver: Driver = {
      ...currentDriver,
      name,
      licenseNo,
      phoneNumber,
      email,
      status,
      notes
    };
    
    updateDriver(updatedDriver);
    setIsEditDialogOpen(false);
    resetForm();
  };
  
  const handleDelete = () => {
    if (!currentDriver) return;
    deleteDriver(currentDriver.id);
    setIsDeleteDialogOpen(false);
    resetForm();
  };
  
  const openEditDialog = (driver: Driver) => {
    setCurrentDriver(driver);
    setName(driver.name);
    setLicenseNo(driver.licenseNo);
    setPhoneNumber(driver.phoneNumber || '');
    setEmail(driver.email || '');
    setStatus(driver.status);
    setNotes(driver.notes || '');
    setIsEditDialogOpen(true);
  };
  
  const openDeleteDialog = (driver: Driver) => {
    setCurrentDriver(driver);
    setIsDeleteDialogOpen(true);
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-500/20 text-green-500 border-green-500/50';
      case 'on-duty':
        return 'bg-blue-500/20 text-blue-500 border-blue-500/50';
      case 'off-duty':
        return 'bg-gray-500/20 text-gray-500 border-gray-500/50';
      case 'pending-approval':
        return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/50';
      case 'approved':
        return 'bg-emerald-500/20 text-emerald-500 border-emerald-500/50';
      default:
        return 'bg-gray-500/20 text-gray-500 border-gray-500/50';
    }
  };
  
  return (
    <DashboardPanel title="Drivers" icon={<UsersRound size={16} />}>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Driver Management</h2>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-yellow-500 hover:bg-yellow-600 text-black">
                <Plus size={16} className="mr-2" />
                Add Driver
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Driver</DialogTitle>
                <DialogDescription>
                  Enter the details of the new driver below
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Full name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="licenseNo">License Number</Label>
                    <Input
                      id="licenseNo"
                      value={licenseNo}
                      onChange={(e) => setLicenseNo(e.target.value)}
                      placeholder="License number"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="Phone number"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email address"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={status} onValueChange={(value: any) => setStatus(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending-approval">Pending Approval</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="on-duty">On Duty</SelectItem>
                      <SelectItem value="off-duty">Off Duty</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Input
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Any additional notes"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => {
                  setIsAddDialogOpen(false);
                  resetForm();
                }}>Cancel</Button>
                <Button 
                  onClick={handleAdd}
                  disabled={!name || !licenseNo}
                  className="bg-yellow-500 hover:bg-yellow-600 text-black"
                >
                  Add Driver
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="text-xs text-muted-foreground border-b border-border/20">
                <th className="text-left pb-2 font-medium">Name</th>
                <th className="text-left pb-2 font-medium">License No.</th>
                <th className="text-left pb-2 font-medium">Phone</th>
                <th className="text-left pb-2 font-medium">Status</th>
                <th className="text-right pb-2 font-medium">Last Trip</th>
                <th className="text-right pb-2 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {drivers.length === 0 ? (
                <tr className="h-16">
                  <td colSpan={6} className="text-center text-muted-foreground">
                    No drivers registered
                  </td>
                </tr>
              ) : (
                drivers.map((driver) => (
                  <tr key={driver.id} className="border-b border-border/10 h-14">
                    <td>{driver.name}</td>
                    <td>{driver.licenseNo}</td>
                    <td>{driver.phoneNumber}</td>
                    <td>
                      <Badge className={getStatusColor(driver.status)}>
                        {driver.status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      </Badge>
                    </td>
                    <td className="text-right">{driver.lastTrip || 'N/A'}</td>
                    <td className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => openEditDialog(driver)}
                          className="h-8 w-8 p-0"
                        >
                          <Pencil size={16} />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => openDeleteDialog(driver)}
                          className="h-8 w-8 p-0 text-red-500"
                        >
                          <Trash2 size={16} />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Driver</DialogTitle>
            <DialogDescription>
              Update driver information below
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Full Name</Label>
                <Input
                  id="edit-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-licenseNo">License Number</Label>
                <Input
                  id="edit-licenseNo"
                  value={licenseNo}
                  onChange={(e) => setLicenseNo(e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-phone">Phone Number</Label>
                <Input
                  id="edit-phone"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-status">Status</Label>
              <Select value={status} onValueChange={(value: any) => setStatus(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending-approval">Pending Approval</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="on-duty">On Duty</SelectItem>
                  <SelectItem value="off-duty">Off Duty</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-notes">Notes</Label>
              <Input
                id="edit-notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsEditDialogOpen(false);
              resetForm();
            }}>Cancel</Button>
            <Button 
              onClick={handleEdit}
              disabled={!name || !licenseNo}
              className="bg-yellow-500 hover:bg-yellow-600 text-black"
            >
              Update Driver
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this driver? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {currentDriver && (
              <div className="border border-border/20 rounded-md p-4">
                <p><strong>Name:</strong> {currentDriver.name}</p>
                <p><strong>License No:</strong> {currentDriver.licenseNo}</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsDeleteDialogOpen(false);
              resetForm();
            }}>Cancel</Button>
            <Button 
              variant="destructive" 
              onClick={handleDelete}
            >
              Delete Driver
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardPanel>
  );
};

export default Drivers;
