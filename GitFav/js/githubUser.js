export class GithubUser{
    static async search(username){
        const url = `https://api.github.com/users/${username}`

        const data = await fetch(url)
        const { login, name, public_repos, followers } = await data.json()
        return ({
            login,
            name,
            public_repos,
            followers
        })
    }
}