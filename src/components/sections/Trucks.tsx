
import React, { useState } from 'react';
import DashboardPanel from '../DashboardPanel';
import { Truck as TruckIcon, Plus, Pencil, Trash2, MapPin } from 'lucide-react';
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
import { Switch } from "@/components/ui/switch";
import { useFleet } from '@/context/FleetContext';
import { Truck } from '@/types/trucks';

const Trucks: React.FC = () => {
  const { trucks, addTruck, updateTruck, deleteTruck } = useFleet();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentTruck, setCurrentTruck] = useState<Truck | null>(null);
  
  // Form state
  const [plateNo, setPlateNo] = useState('');
  const [model, setModel] = useState('');
  const [capacity, setCapacity] = useState('');
  const [fuelCapacity, setFuelCapacity] = useState('');
  const [status, setStatus] = useState<Truck['status']>('available');
  const [gpsEnabled, setGpsEnabled] = useState(false);
  const [gpsId, setGpsId] = useState('');
  const [notes, setNotes] = useState('');
  
  const resetForm = () => {
    setPlateNo('');
    setModel('');
    setCapacity('');
    setFuelCapacity('');
    setStatus('available');
    setGpsEnabled(false);
    setGpsId('');
    setNotes('');
    setCurrentTruck(null);
  };
  
  const handleAdd = () => {
    const newTruck: Truck = {
      id: `truck-${Date.now()}`,
      plateNo,
      model,
      capacity,
      fuelCapacity,
      status,
      gpsEnabled,
      gpsId: gpsEnabled ? gpsId : undefined,
      currentLocation: gpsEnabled ? [3.3792, 6.4550] : undefined, // Default to Lagos coordinates
      notes,
      createdAt: new Date().toISOString().split('T')[0]
    };
    
    addTruck(newTruck);
    setIsAddDialogOpen(false);
    resetForm();
  };
  
  const handleEdit = () => {
    if (!currentTruck) return;
    
    const updatedTruck: Truck = {
      ...currentTruck,
      plateNo,
      model,
      capacity,
      fuelCapacity,
      status,
      gpsEnabled,
      gpsId: gpsEnabled ? gpsId : undefined,
      notes
    };
    
    updateTruck(updatedTruck);
    setIsEditDialogOpen(false);
    resetForm();
  };
  
  const handleDelete = () => {
    if (!currentTruck) return;
    deleteTruck(currentTruck.id);
    setIsDeleteDialogOpen(false);
    resetForm();
  };
  
  const openEditDialog = (truck: Truck) => {
    setCurrentTruck(truck);
    setPlateNo(truck.plateNo);
    setModel(truck.model);
    setCapacity(truck.capacity);
    setFuelCapacity(truck.fuelCapacity);
    setStatus(truck.status);
    setGpsEnabled(truck.gpsEnabled);
    setGpsId(truck.gpsId || '');
    setNotes(truck.notes || '');
    setIsEditDialogOpen(true);
  };
  
  const openDeleteDialog = (truck: Truck) => {
    setCurrentTruck(truck);
    setIsDeleteDialogOpen(true);
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-500/20 text-green-500 border-green-500/50';
      case 'in-use':
        return 'bg-blue-500/20 text-blue-500 border-blue-500/50';
      case 'maintenance':
        return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/50';
      case 'out-of-service':
        return 'bg-red-500/20 text-red-500 border-red-500/50';
      default:
        return 'bg-gray-500/20 text-gray-500 border-gray-500/50';
    }
  };
  
  return (
    <DashboardPanel title="Trucks" icon={<TruckIcon size={16} />}>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Truck Management</h2>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-yellow-500 hover:bg-yellow-600 text-black">
                <Plus size={16} className="mr-2" />
                Add Truck
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Truck</DialogTitle>
                <DialogDescription>
                  Enter the details of the new truck below
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="plateNo">Plate Number</Label>
                    <Input
                      id="plateNo"
                      value={plateNo}
                      onChange={(e) => setPlateNo(e.target.value)}
                      placeholder="Plate number"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="model">Model</Label>
                    <Input
                      id="model"
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                      placeholder="Truck model"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="capacity">Capacity</Label>
                    <Input
                      id="capacity"
                      value={capacity}
                      onChange={(e) => setCapacity(e.target.value)}
                      placeholder="e.g. 33,000 litres"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fuelCapacity">Fuel Tank Capacity</Label>
                    <Input
                      id="fuelCapacity"
                      value={fuelCapacity}
                      onChange={(e) => setFuelCapacity(e.target.value)}
                      placeholder="e.g. 400 litres"
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
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="in-use">In Use</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                      <SelectItem value="out-of-service">Out of Service</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="gpsEnabled">GPS Tracking</Label>
                    <div className="text-sm text-muted-foreground">Enable GPS tracking for this truck</div>
                  </div>
                  <Switch
                    id="gpsEnabled"
                    checked={gpsEnabled}
                    onCheckedChange={setGpsEnabled}
                    className="data-[state=checked]:bg-yellow-500"
                  />
                </div>
                {gpsEnabled && (
                  <div className="space-y-2">
                    <Label htmlFor="gpsId">GPS Tracker ID</Label>
                    <Input
                      id="gpsId"
                      value={gpsId}
                      onChange={(e) => setGpsId(e.target.value)}
                      placeholder="GPS device ID"
                    />
                  </div>
                )}
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
                  disabled={!plateNo || !capacity}
                  className="bg-yellow-500 hover:bg-yellow-600 text-black"
                >
                  Add Truck
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="text-xs text-muted-foreground border-b border-border/20">
                <th className="text-left pb-2 font-medium">Plate No.</th>
                <th className="text-left pb-2 font-medium">Model</th>
                <th className="text-left pb-2 font-medium">Capacity</th>
                <th className="text-left pb-2 font-medium">GPS</th>
                <th className="text-center pb-2 font-medium">Status</th>
                <th className="text-right pb-2 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {trucks.length === 0 ? (
                <tr className="h-16">
                  <td colSpan={6} className="text-center text-muted-foreground">
                    No trucks registered
                  </td>
                </tr>
              ) : (
                trucks.map((truck) => (
                  <tr key={truck.id} className="border-b border-border/10 h-14">
                    <td>{truck.plateNo}</td>
                    <td>{truck.model}</td>
                    <td>{truck.capacity}</td>
                    <td>
                      {truck.gpsEnabled ? (
                        <Badge className="bg-green-500/20 text-green-500 border-green-500/50">
                          <MapPin size={12} className="mr-1" /> Active
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">Disabled</span>
                      )}
                    </td>
                    <td className="text-center">
                      <Badge className={getStatusColor(truck.status)}>
                        {truck.status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      </Badge>
                    </td>
                    <td className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => openEditDialog(truck)}
                          className="h-8 w-8 p-0"
                        >
                          <Pencil size={16} />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => openDeleteDialog(truck)}
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
            <DialogTitle>Edit Truck</DialogTitle>
            <DialogDescription>
              Update truck information below
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-plateNo">Plate Number</Label>
                <Input
                  id="edit-plateNo"
                  value={plateNo}
                  onChange={(e) => setPlateNo(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-model">Model</Label>
                <Input
                  id="edit-model"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-capacity">Capacity</Label>
                <Input
                  id="edit-capacity"
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-fuelCapacity">Fuel Tank Capacity</Label>
                <Input
                  id="edit-fuelCapacity"
                  value={fuelCapacity}
                  onChange={(e) => setFuelCapacity(e.target.value)}
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
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="in-use">In Use</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="out-of-service">Out of Service</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="edit-gpsEnabled">GPS Tracking</Label>
                <div className="text-sm text-muted-foreground">Enable GPS tracking for this truck</div>
              </div>
              <Switch
                id="edit-gpsEnabled"
                checked={gpsEnabled}
                onCheckedChange={setGpsEnabled}
                className="data-[state=checked]:bg-yellow-500"
              />
            </div>
            {gpsEnabled && (
              <div className="space-y-2">
                <Label htmlFor="edit-gpsId">GPS Tracker ID</Label>
                <Input
                  id="edit-gpsId"
                  value={gpsId}
                  onChange={(e) => setGpsId(e.target.value)}
                />
              </div>
            )}
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
              disabled={!plateNo || !capacity}
              className="bg-yellow-500 hover:bg-yellow-600 text-black"
            >
              Update Truck
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
              Are you sure you want to delete this truck? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {currentTruck && (
              <div className="border border-border/20 rounded-md p-4">
                <p><strong>Plate Number:</strong> {currentTruck.plateNo}</p>
                <p><strong>Model:</strong> {currentTruck.model}</p>
                <p><strong>Capacity:</strong> {currentTruck.capacity}</p>
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
              Delete Truck
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardPanel>
  );
};

export default Trucks;
