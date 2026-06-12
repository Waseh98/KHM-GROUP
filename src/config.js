export const PAYMENT_METHODS_CONFIG = [
  {
    id: 'easypaisa',
    name: 'EasyPaisa',
    icon: '/images/easypaisa-logo.jfif',
    color: '#00A651',
    gradient: 'linear-gradient(135deg, #00A651 0%, #00C853 100%)',
    details: { 
      title: 'EasyPaisa Account', 
      lines: ['Account Title: Wajid', 'Number: 03329230018'] 
    },
  },
  {
    id: 'jazzcash',
    name: 'JazzCash',
    icon: '💳',
    color: '#E30613',
    gradient: 'linear-gradient(135deg, #E30613 0%, #FF1744 100%)',
    details: { 
      title: 'JazzCash Account', 
      lines: ['Account Title: Tanzeela Khalid', 'Number: 03254324502'] 
    },
  },
  {
    id: 'bank_transfer',
    name: 'Bank Transfer',
    icon: '🏦',
    color: '#1A73E8',
    gradient: 'linear-gradient(135deg, #1A73E8 0%, #448AFF 100%)',
    details: {
      title: 'Bank Details',
      lines: [
        'Bank: UBL', 
        'Account Title: Haroon Waryam', 
        'Account #: 1706314439246', 
        'IBAN: pk40UNIL0109000314439246'
      ],
    },
  },
];
