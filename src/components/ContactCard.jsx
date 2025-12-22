import { Phone, Mail, MapPin, Trash2, Edit2, User } from 'lucide-react';

export function ContactCard({ contact, onDelete, onEdit, canEdit, canDelete }) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200 overflow-hidden group">
            <div className="p-5">
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center border border-gray-200">
                            {contact.avatar_url ? (
                                <img src={contact.avatar_url} alt={contact.name} className="h-full w-full object-cover" />
                            ) : (
                                <User size={24} className="text-gray-400" />
                            )}
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 text-lg">{contact.name}</h3>
                            <p className="text-xs text-gray-500">Added {new Date(contact.created_at).toLocaleDateString()}</p>
                        </div>
                    </div>

                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
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
                        <Mail size={16} className="text-gray-400" />
                        <a href={`mailto:${contact.email}`} className="hover:text-blue-600 truncate">{contact.email}</a>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600 text-sm">
                        <Phone size={16} className="text-gray-400" />
                        <a href={`tel:${contact.phone}`} className="hover:text-blue-600">{contact.phone}</a>
                    </div>
                    {contact.address && (
                        <div className="flex items-start gap-3 text-gray-600 text-sm">
                            <MapPin size={16} className="text-gray-400 mt-1 shrink-0" />
                            <span>{contact.address}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
