import { createRoot } from 'react-dom/client'
import { Button } from 'antd'

createRoot(document.getElementById('root')!).render(
  <div>
    Hey 👋
    <br />
    <Button type='primary'>按钮</Button>
  </div>
)