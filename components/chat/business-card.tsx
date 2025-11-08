import {
  IconBuilding,
  IconGlobe,
  IconMapPin,
  IconPhone,
  IconBookmark,
  IconEye,
  IconShare
} from "@tabler/icons-react"
import { FC, useState } from "react"

interface Business {
  vendor_formal_name: string
  vendor_dba?: string
  address1: string
  city: string
  borough?: string
  naics_sector: string
  naics_title: string
  telephone?: string
  website?: string
  business_description?: string
}

interface BusinessCardProps {
  business: Business
  onSave?: (business: Business) => void
  onViewDetails?: (business: Business) => void
  onShare?: (business: Business) => void
}

export const BusinessCard: FC<BusinessCardProps> = ({
  business,
  onSave,
  onViewDetails,
  onShare
}) => {
  const [isSaved, setIsSaved] = useState(false)

  const handleSave = () => {
    setIsSaved(!isSaved)
    onSave?.(business)
  }

  const businessName = business.vendor_dba || business.vendor_formal_name

  return (
    <div className="card-hover bg-card/50 shadow-soft hover:border-primary/20 hover:bg-card group rounded-xl border p-4 backdrop-blur-sm transition-all">
      {/* Header */}
      <div className="mb-3 flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-card-foreground group-hover:text-primary line-clamp-2 font-semibold">
            {businessName}
          </h3>
          {business.vendor_dba &&
            business.vendor_formal_name !== business.vendor_dba && (
              <p className="text-muted-foreground mt-1 text-xs">
                {business.vendor_formal_name}
              </p>
            )}
        </div>
        <button
          onClick={handleSave}
          className={`rounded-full p-1.5 transition-colors ${
            isSaved
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary"
          }`}
          title={isSaved ? "Saved" : "Save business"}
        >
          <IconBookmark size={16} fill={isSaved ? "currentColor" : "none"} />
        </button>
      </div>

      {/* Location */}
      <div className="text-muted-foreground mb-2 flex items-center text-sm">
        <IconMapPin size={14} className="mr-2 shrink-0" />
        <span className="line-clamp-1">
          {business.address1}, {business.city}
        </span>
      </div>

      {/* Category */}
      <div className="text-muted-foreground mb-3 flex items-center text-sm">
        <IconBuilding size={14} className="mr-2 shrink-0" />
        <span className="line-clamp-1">{business.naics_title}</span>
      </div>

      {/* Borough Badge */}
      {business.borough && (
        <div className="mb-3">
          <span className="bg-primary/10 text-primary inline-block rounded-full px-2 py-1 text-xs font-medium">
            {business.borough}
          </span>
        </div>
      )}

      {/* Contact Info */}
      <div className="mb-4 flex flex-wrap gap-2 text-xs">
        {business.telephone && (
          <a
            href={`tel:${business.telephone}`}
            className="text-info flex items-center hover:underline"
          >
            <IconPhone size={12} className="mr-1" />
            {business.telephone}
          </a>
        )}
        {business.website && (
          <a
            href={business.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-info flex items-center hover:underline"
          >
            <IconGlobe size={12} className="mr-1" />
            Website
          </a>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={() => onViewDetails?.(business)}
          className="bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary flex flex-1 items-center justify-center gap-1 rounded-lg px-3 py-2 text-xs font-medium transition-colors"
        >
          <IconEye size={14} />
          Details
        </button>
        <button
          onClick={() => onShare?.(business)}
          className="bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary flex items-center justify-center gap-1 rounded-lg px-3 py-2 text-xs font-medium transition-colors"
        >
          <IconShare size={14} />
        </button>
      </div>
    </div>
  )
}
