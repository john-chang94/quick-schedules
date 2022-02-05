// Return blank page during page load
// Prevents the flashing of the sign in page during page reload
const IsLoaded = ({ isLoading, children }) => {
    while (isLoading) return null
    return children
}

export default IsLoaded;