export const getBusTypeColor = (type: string) => {
  switch (type.toLowerCase()) {
    case 'volvo':
      return '#4CAF50';
    case 'mini':
      return '#2196F3';
    case 'sleeper':
      return '#9C27B0';
    default:
      return '#607D8B';
  }
};
