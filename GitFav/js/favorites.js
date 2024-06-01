import { GithubUser } from "./githubUser.js"

export class Favorites{
    constructor(root){
        this.root = document.querySelector(root)
        this.load()
    }

    load(){
        const inputSearch = document.querySelector("#input-search")
        window.onload = () =>{
            inputSearch.focus()
        }
        this.entries = JSON.parse(localStorage.getItem('@github-favorites:')) || []
    }

    save(){
        localStorage.setItem('@github-favorites:', JSON.stringify(this.entries))
        window.location.reload()
    }

    async add(input){
        try{

            const userExistis = this.entries.find(entry => entry.login === input)

            if(userExistis) {
                throw new Error ('Usuário já Cadastrado!')
            }

            const githubUser = await GithubUser.search(input)
            if(githubUser.login === undefined){
                throw new Error("Usuário não encontrado.")
            }

            this.entries = [githubUser, ...this.entries]
            this.update()
            this.save()

        }catch(error){
            alert(error.message)
        }
    }

    delete(user){
        const filteredEntries =  this.entries
            .filter(entry => entry.login !== user.login)

        this.entries = filteredEntries
        this.update()
        this.save()
    }
}

export class FavoritesView extends Favorites{
    constructor(root){
        super(root)

        this.tbody = this.root.querySelector('#list')
        this.tfoot = this.root.querySelector('table tfoot')

        this.update()
        this.onAdd()
    }

    onAdd(){
        const addButton = document.querySelector("#search-button")
        const inputSearch = document.querySelector("#input-search")

        inputSearch.onsearch = () =>{
            const {value} = this.root.querySelector("#input-search")
            this.add(value)
        }

        addButton.onclick = () => {
            const {value} = this.root.querySelector("#input-search")
            this.add(value)
        }

    }

    update(){
        this.removeAllTr()
        this.isEmpty()
      
        this.entries.forEach(user =>{
        const row = this.createRow()
        row.querySelector('.user img').src = `https://github.com/${user.login}.png`
        row.querySelector('.user img').alt = `Imagem de ${user.name}`
        row.querySelector('.user a').href = `https://github.com/${user.login}`
        row.querySelector('.user p').textContent = user.name
        row.querySelector('.user span').textContent = user.login
        row.querySelector('.repositories').textContent = user.public_repos
        row.querySelector('.followers').textContent = user.followers

        row.querySelector('.remove').onclick = () =>{
            const isOK = confirm('Tem Certeza que deseja deletar essa linha?')
            if(isOK){
                this.delete(user)
            }
        }
        
        this.tbody.append(row)
        this.tfoot.remove(this.listEmpty())

        })
    
    }

    removeAllTr(){
        this.tbody.querySelectorAll('tr').forEach((tr) => {
            tr.remove()
        });
    }

    createRow(){
        const tr = document.createElement('tr')

        tr.setAttribute("class", "tbody-content")

        tr.innerHTML = 
        `<td class="user">
                <img src="" alt="">
                <a href="" target="_blank">
                    <p></p>
                    <span></span>
                </a>
        </td>
        <td class="repositories"></td>
        <td class="followers"></td>
        <td>
            <button class="remove">
                Remover
            </button>
        </td>`
        return tr
    }

    isEmpty(){       
        if(this.entries.length === 0){
            this.tfoot.append(this.listEmpty())
            this.tbody.style.display = "none"
        }
    }

    listEmpty(){
        const tb_empty = document.createElement('tr')

        tb_empty.setAttribute("class", "empty")

        tb_empty.innerHTML = `
            <td colspan="4">
                <div>
                    <img src="https://raw.githubusercontent.com/1felipeaac/gitfav/main/assets/star-empty.svg" alt="star icon table empty">
                    <p>Nenhum favorito ainda</p>
                </div>
            </td>
        `

        return tb_empty
    }
}