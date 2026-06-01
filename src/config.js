export const PAYMENT_METHODS_CONFIG = [
  {
    id: 'easypaisa',
    name: 'EasyPaisa',
    icon: 'https://www.easypaisa.com.pk/wp-content/uploads/2026/01/cropped-cropped-easypaisa-logo-dark-1.png',
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
    icon: 'https://www.jazzcash.com.pk/assets/themes/jazzcash/img/jazzcash-logo.png',
    color: '#E30613',
    gradient: 'linear-gradient(135deg, #E30613 0%, #FF1744 100%)',
    details: { 
      title: 'JazzCash Account', 
      lines: ['Account Title: Abdul Wasi', 'Number: 03438756714'] 
    },
  },
  {
    id: 'bank_transfer',
    name: 'Bank Transfer',
    icon: 'https://cdn-icons-png.flaticon.com/512/888/888870.png',
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
