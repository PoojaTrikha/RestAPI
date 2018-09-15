import { JsonController, Get, Param, Post, Put, Body, NotFoundError, BadRequestError,HttpCode,BodyParam } from 'routing-controllers'
import Page, { Colors, defaultBoard } from './entity'
import { moves } from './index'

@JsonController()
export default class PageController {
    
    @Get('/pages')
    async allPages() {
        const pages = await Page.find()
        return { pages }
    }

    @Get('/pages/:id')
    getPage(
        @Param('id') id: number
    ) {
        return Page.findOne(id)
    }

    @Put('/pages/:id')
    async updatePage(
        @Param('id') id: number,
        @Body() update: Partial<Page>
    ) {
        const page = await Page.findOne(id)
        if (!page) throw new NotFoundError('Cannot find game')
        update.id = undefined
        const color = update.color
        if(color !== undefined && Colors.indexOf(color) < 0) 
        throw new BadRequestError('This colour is not defined in our predefined colour list')

        if(update.board !== undefined) {
            const numberOfMoves = moves(page.board, update.board)
            if(numberOfMoves === 0) throw new BadRequestError('There is no move provided!')
            if(numberOfMoves !== 1) throw new BadRequestError('Only one moved is allowed!')
        }
           
        return Page.merge(page, update).save()
    }

    @Post('/pages')
    @HttpCode(201)
    createGame(
        @BodyParam("name", {required: true}) name : string
    ) {
       const page = new Page()
       page.name = name
       page.color = Colors[Math.floor(Math.random() * Colors.length)]
       page.board = defaultBoard
       return page.save()
    }
}

