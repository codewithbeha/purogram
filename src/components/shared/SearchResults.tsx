import { Models } from "appwrite";
import Loader from "./Loader";
import GirdPostList from "./GirdPostList";

type SearchResultsProps = {
  isSearchFetching: boolean;
  searchedPosts: Models.Document[];
};

const SearchResults = ({
  isSearchFetching,
  searchedPosts,
}: SearchResultsProps) => {
  if (isSearchFetching) return <Loader />;

  if (searchedPosts && searchedPosts.documents.lenth > 0){
    return (
        <GirdPostList posts={searchedPosts.documents}/>
    )
  } 

  return (
    <p className="text-light-4 mt-10 text-center w-full">No results found.</p>
  )
};

export default SearchResults;
