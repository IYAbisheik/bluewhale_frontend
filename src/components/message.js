import { useEffect, useState } from 'react';

function Message() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/api/message')
      .then((res) => res.json())
      .then((data) => setMessage(data.message))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <h1>React + Node.js Setup</h1>
      <p>{message}</p>
    </div>
  );
}

export default Message;