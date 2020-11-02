import Page from '../components/Page';

export default function Home() {
  return (
    <Page title="日本語 Grammar Dictionary" tabTitle="日本語 Grammar Dictionary">
      <div id="search-area">
        <input type="text" placeholder="Search here" />
      </div>
      <div id="result-area">
        { [1, 2, 3, 4, 5, 6].map(res => 
          <div key={res} className="result">RESULT {res}</div>
        )}
      </div>
    </Page>
  )
}
