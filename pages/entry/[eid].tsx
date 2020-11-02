import { useRouter } from 'next/router'
import Page from '../../components/Page';

const Entry = () => {
  const router = useRouter()
  const { eid } = router.query

  return (
    <Page title="日本語 Grammar Entry" tabTitle="Entry: eid">
        <p>Entry: {eid}</p>
    </Page>
  )
}

export default Entry