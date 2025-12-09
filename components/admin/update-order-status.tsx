'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { updateOrderStatus } from '@/lib/actions/orders'
import { toast } from '@/lib/hooks/use-toast'
import { Loader2 } from 'lucide-react'

interface UpdateOrderStatusProps {
  orderId: string
  currentStatus: string
}

export function UpdateOrderStatus({ orderId, currentStatus }: UpdateOrderStatusProps) {
  const [status, setStatus] = useState(currentStatus)
  const [isLoading, setIsLoading] = useState(false)

  const handleUpdate = async () => {
    if (status === currentStatus) {
      toast.error('Le statut est déjà à jour')
      return
    }

    setIsLoading(true)
    try {
      const result = await updateOrderStatus(orderId, status)
      
      if (result.success) {
        toast.success('Statut mis à jour avec succès')
      } else {
        toast.error(result.error || 'Erreur lors de la mise à jour')
      }
    } catch (error) {
      toast.error('Une erreur est survenue')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center gap-3">
      <Select value={status} onValueChange={setStatus}>
        <SelectTrigger className="w-[200px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="pending">En attente</SelectItem>
          <SelectItem value="processing">En traitement</SelectItem>
          <SelectItem value="shipped">Expédiée</SelectItem>
          <SelectItem value="delivered">Livrée</SelectItem>
          <SelectItem value="cancelled">Annulée</SelectItem>
        </SelectContent>
      </Select>
      <Button
        onClick={handleUpdate}
        disabled={isLoading || status === currentStatus}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Mettre à jour
      </Button>
    </div>
  )
}
