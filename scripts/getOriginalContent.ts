const requestOptions = {
  method: "GET",
  redirect: "follow"
};

async function getContent() {
  try {
    const response = await fetch("https://slicify-v3-template-dev.prismic.io/api/v2/documents/search?ref=Z_-rFhEAACIABjhg", requestOptions);
    const result = await response.text();
    console.log(result)
  } catch (error) {
    console.error(error);
  };
}