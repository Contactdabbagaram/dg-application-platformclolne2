
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useOutlet } from "@/contexts/OutletContext";

export function RestaurantChangeConfirmationDialog() {
  const { 
      confirmationState, 
      confirmRestaurantChange, 
      cancelRestaurantChange, 
      saving 
  } = useOutlet();

  return (
    <AlertDialog open={confirmationState.isOpen} onOpenChange={(open) => !open && cancelRestaurantChange()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Restaurant Change</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to link this outlet to{' '}
            <strong>{confirmationState.restaurantName || 'the selected restaurant'}</strong>?
            <br /><br />
            This will change all associated menu and store data. This action affects live data and cannot be easily undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={saving} onClick={cancelRestaurantChange}>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            disabled={saving} 
            onClick={() => confirmRestaurantChange()}
            className="bg-destructive hover:bg-destructive/90"
          >
            {saving ? "Linking..." : "Yes, link restaurant"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
