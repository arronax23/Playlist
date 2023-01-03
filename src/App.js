import Card from "./components/Card";

function App() {
  const author = "Coco & Breezy, Tara Carosielli";
  const title = "Just Say";
  const imageURL = "https://i.ytimg.com/vi/o0tfrCzuAAo/hq720.jpg?sqp=-oaymwE2COgCEMoBSFXyq4qpAygIARUAAIhCGAFwAcABBvABAfgB_gmAAtAFigIMCAAQARh_IEQoEzAP&rs=AOn4CLA1Hz1kdMFuflHmzB8wbWrGBSYMTA"
  
  const author2 = "Tiësto, Jonas Blue & Rita Ora";
  const title2 = "Ritual";
  const imageURL2 = "https://i.ytimg.com/vi/ontU9cOg354/hqdefault.jpg?sqp=-oaymwEXCNACELwBSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLDsSACqZaCqCpAzN_tURTI8rai60Q";
  
  return (
    <div className="app">
      <Card imageURL={imageURL} author={author} title={title} />
      <Card imageURL={imageURL} author={author} title={title} />
      <Card imageURL={imageURL2} author={author2} title={title2} />
      <Card imageURL={imageURL2} author={author2} title={title2} />
    </div>
  );
}

export default App;
