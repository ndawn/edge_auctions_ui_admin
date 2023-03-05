const StatusBadge = ({ theme, status }) => (
  <div
    style={{
      backgroundColor: {
        pending: theme.palette.warning.dark,
        success: '#009c41',
        failed: theme.palette.error.dark,
      }[status],
      margin: 'auto',
      width: '8px',
      height: '8px',
      borderRadius: '4px',
    }}
  ></div>
);

export default StatusBadge;
