import React, { useState } from 'react';
import DashboardPanel from '../DashboardPanel';
import { TruckIcon, Plus, Pencil, Trash2, MapPin, ToggleLeft, ToggleRight } from 'lucide-react';
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
import { Truck } from '@/types/trucks';
import { Switch } from '../ui/switch';
import { toast } from 'sonner';

const Trucks: React.FC = () => {
  const { trucks, addTruck, updateTruck, deleteTruck } = useFleet();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentTruck, setCurrentTruck] = useState<Truck | null>(null);
  
  // Form state
  const [plate_no, setPlateNo] = useState('');
  const [model, setModel] = useState('');
  const [capacity, setCapacity] = useState('');
  const [fuel_capacity, setFuelCapacity] = useState('');
  const [status, setStatus] = useState<Truck['status']>('available');
  const [gps_enabled, setGpsEnabled] = useState(false);
  const [gps_id, setGpsId] = useState('');
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
    const newTruck: Partial<Truck> = {
      plate_no,
      model,
      capacity,
      fuel_capacity,
      status,
      gps_enabled,
      gps_id: gps_enabled ? (gps_id || `GPS-${Date.now().toString().slice(-6)}`) : undefined,
      notes,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    // Generate a random location in Nigeria if GPS is enabled
    if (gps_enabled) {
      // Nigeria approximate bounds: lat 4-14, lng 2-15
      const lat = 4 + Math.random() * 10; // between 4 and 14
      const lng = 2 + Math.random() * 13; // between 2 and 15
      newTruck.current_location = [lng, lat]; // Order matters: [longitude, latitude]
    }
    
    addTruck(newTruck as Truck)
      .then(() => {
        setIsAddDialogOpen(false);
        resetForm();
      })
      .catch(error => {
        console.error('Error in add truck handler:', error);
      });
  };
  
  const handleEdit = () => {
    if (!currentTruck) return;
    
    const updatedTruck: Partial<Truck> = {
      id: currentTruck.id,
      plate_no,
      model,
      capacity,
      fuel_capacity,
      status,
      gps_enabled,
      notes,
      updated_at: new Date().toISOString()
    };
    
    // Update GPS ID if GPS is enabled
    if (gps_enabled) {
      updatedTruck.gps_id = gps_id || currentTruck.gps_id || `GPS-${Date.now().toString().slice(-6)}`;
      
      // Generate location if newly GPS enabled and no location exists
      if (!currentTruck.gps_enabled || !currentTruck.current_location) {
        const lat = 4 + Math.random() * 10; // between 4 and 14
        const lng = 2 + Math.random() * 13; // between 2 and 15
        updatedTruck.current_location = [lng, lat]; // Order matters: [longitude, latitude]
      }
    } else {
      // Remove GPS data if disabled
      updatedTruck.gps_id = undefined;
      updatedTruck.current_location = undefined;
    }
    
    updateTruck(currentTruck.id, updatedTruck)
      .then(() => {
        setIsEditDialogOpen(false);
        resetForm();
      })
      .catch(error => {
        console.error('Error in update truck handler:', error);
      });
  };
  
  const handleDelete = () => {
    if (!currentTruck) return;
    deleteTruck(currentTruck.id);
    setIsDeleteDialogOpen(false);
    resetForm();
  };
  
  const openEditDialog = (truck: Truck) => {
    setCurrentTruck(truck);
    setPlateNo(truck.plate_no);
    setModel(truck.model);
    setCapacity(truck.capacity);
    setFuelCapacity(truck.fuel_capacity || '');
    setStatus(truck.status);
    setGpsEnabled(truck.gps_enabled || false);
    setGpsId(truck.gps_id || '');
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
  
  const viewTruckLocation = (truck: Truck) => {
    if (truck.current_location) {
      toast.info(`Truck ${truck.plate_no} is at coordinates: ${truck.current_location[1].toFixed(4)}, ${truck.current_location[0].toFixed(4)}`);
    } else {
      toast.warning(`No location data available for truck ${truck.plate_no}`);
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
                    <Label htmlFor="plate_no">License Plate</Label>
                    <Input
                      id="plate_no"
                      value={plate_no}
                      onChange={(e) => setPlateNo(e.target.value)}
                      placeholder="License plate"
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
                    <Label htmlFor="fuel_capacity">Fuel Tank Capacity</Label>
                    <Input
                      id="fuel_capacity"
                      value={fuel_capacity}
                      onChange={(e) => setFuelCapacity(e.target.value)}
                      placeholder="e.g. 200 litres"
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
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="gps_enabled">GPS Tracking Enabled</Label>
                    <Switch 
                      id="gps_enabled" 
                      checked={gps_enabled} 
                      onCheckedChange={setGpsEnabled} 
                      className="data-[state=checked]:bg-yellow-500"
                    />
                  </div>
                  {gps_enabled && (
                    <div className="mt-2">
                      <Label htmlFor="gps_id">GPS ID (optional)</Label>
                      <Input
                        id="gps_id"
                        value={gps_id}
                        onChange={(e) => setGpsId(e.target.value)}
                        placeholder="Auto-generated if blank"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        A GPS ID will be auto-generated if not provided
                      </p>
                    </div>
                  )}
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
                  disabled={!plate_no || !model || !capacity}
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
                <th className="text-left pb-2 font-medium">Status</th>
                <th className="text-center pb-2 font-medium">GPS</th>
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
                    <td>{truck.plate_no}</td>
                    <td>{truck.model}</td>
                    <td>{truck.capacity}</td>
                    <td>
                      <Badge className={getStatusColor(truck.status)}>
                        {truck.status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      </Badge>
                    </td>
                    <td className="text-center">
                      {truck.gps_enabled ? (
                        <div className="flex items-center justify-center">
                          <span 
                            className="text-green-500 flex items-center cursor-pointer"
                            onClick={() => viewTruckLocation(truck)}
                          >
                            <MapPin size={16} className="mr-1" />
                            <span className="text-xs">Active</span>
                          </span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-xs">Disabled</span>
                      )}
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
                <Label htmlFor="edit-plate_no">License Plate</Label>
                <Input
                  id="edit-plate_no"
                  value={plate_no}
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
                <Label htmlFor="edit-fuel_capacity">Fuel Tank Capacity</Label>
                <Input
                  id="edit-fuel_capacity"
                  value={fuel_capacity}
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
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="edit-gps_enabled">GPS Tracking Enabled</Label>
                <Switch 
                  id="edit-gps_enabled" 
                  checked={gps_enabled} 
                  onCheckedChange={setGpsEnabled} 
                  className="data-[state=checked]:bg-yellow-500"
                />
              </div>
              {gps_enabled && (
                <div className="mt-2">
                  <Label htmlFor="edit-gps_id">GPS ID</Label>
                  <Input
                    id="edit-gps_id"
                    value={gps_id}
                    onChange={(e) => setGpsId(e.target.value)}
                    placeholder="Auto-generated if blank"
                  />
                </div>
              )}
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
              disabled={!plate_no || !model || !capacity}
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
                <p><strong>Plate No:</strong> {currentTruck.plate_no}</p>
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
