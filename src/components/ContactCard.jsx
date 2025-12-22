import { Phone, MapPin, Trash2, Edit2, User } from 'lucide-react';

export function ContactCard({ contact, onDelete, onEdit, canEdit, canDelete, onSelect, isSelected }) {
    // Construct full address string
    const fullAddress = [
        contact.address,
        contact.city,
        contact.state,
        contact.pincode,
        contact.country
    ].filter(Boolean).join(', ');


export function ContactCard({ contact, onDelete, onEdit, canEdit, canDelete }) {
    // Construct full address string
    const fullAddress = [
        contact.address,
        contact.city,
        contact.state,
        contact.pincode,
        contact.country
    ].filter(Boolean).join(', ');

    return (
        <div className={`bg-white rounded-xl shadow-sm border hover:shadow-md transition-all duration-200 overflow-hidden group relative ${isSelected ? 'border-blue-500 ring-1 ring-blue-500 bg-blue-50/10' : 'border-gray-100'}`}>
            {/* Selection Checkbox */}
            <div className="absolute top-4 right-4 z-10">
                <input
                    type="checkbox"
                    checked={isSelected || false}
                    onChange={(e) => onSelect(contact.id, e.target.checked)}
                    className="h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
                />
            </div>

            <div className="p-5">
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-blue-50 overflow-hidden flex items-center justify-center border border-blue-100">
                            <User size={24} className="text-blue-400" />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 text-lg">{contact.name}</h3>
                            <p className="text-xs text-gray-500">Added {new Date(contact.created_at).toLocaleDateString()}</p>
                        </div>
                    </div>

                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity mr-8">
                        {canEdit && (
                            <button
                                onClick={() => onEdit(contact)}
                                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Edit"
                            >
                                <Edit2 size={16} />
                            </button>
                        )}
                        {canDelete && (
                            <button
                                onClick={() => onDelete(contact.id)}
                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Delete"
                            >
                                <Trash2 size={16} />
                            </button>
                        )}
                    </div>
                </div>

                <div className="mt-6 space-y-3">
                    <div className="flex items-center gap-3 text-gray-600 text-sm">
                        <Phone size={16} className="text-gray-400" />
                        <a href={`tel:${contact.phone}`} className="hover:text-blue-600">{contact.phone}</a>
                    </div>
                    {fullAddress && (
                        <div className="flex items-start gap-3 text-gray-600 text-sm">
                            <MapPin size={16} className="text-gray-400 mt-1 shrink-0" />
                            <span>{fullAddress}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
