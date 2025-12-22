export const MOCK_CONTACTS = [
    {
        id: '1',
        name: 'Sarah Connor',
        email: 'sarah@skynet.com',
        phone: '555-0199',
        address: '123 Tech Blvd, Los Angeles',
        avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
        created_at: new Date().toISOString()
    },
    {
        id: '2',
        name: 'John Wick',
        email: 'john@continental.com',
        phone: '555-0100',
        address: '99 Continental Way, NYC',
        avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
        created_at: new Date(Date.now() - 86400000).toISOString()
    }
];
