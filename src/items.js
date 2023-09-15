import express from 'express'
const router = express.Router()
const items = [{id: 1, task: "buy groceries"}, {id:2, task: "clean room"}]



router.get('/', (req, res) => {
    return res.json(items)
})

router.post('/', (req, res) => {
    const requiredProperties = ['id', 'task']
    let missingProperties = []

    requiredProperties.forEach(prop => {
        if (!req.body.hasOwnProperty(prop)) {
            missingProperties.push(prop)
        }
    })

    if (missingProperties.length) { // we do not need a specific comparison here because a 0 is essentially the same as false
        // we have missing properties!
        let errorMessage = []
        missingProperties.forEach(prop => {
            errorMessage.push(`Missing property: ${prop}`)
        })
        return res.status(400).json({ errors: errorMessage })
    }
    items.push(req.body)
    return res.status(201).json(req.body)
})

//Router to get items by id
router.get('/:id', (req, res) => {
    const id = (req.params.id);
    const result = items.find((item) => item.id == id);
    if (result){
    return res.status(200).json(result);
    }
    else{
        res.status(404).json({ message: "Item not found"})
    }
})

//Router to update items by id using a put request

router.put('/:id', (req, res) =>{
    const id = parseInt(req.params.id);   
    const search = items.findIndex((item) => item.id === id)
    const requiredProperties = ['id', 'task']
    let missingProperties = []

    requiredProperties.forEach(prop => {
        if (!req.body.hasOwnProperty(prop)) {
            missingProperties.push(prop)
        }
    })

    if (missingProperties.length) { // we do not need a specific comparison here because a 0 is essentially the same as false
        // we have missing properties!
        let errorMessage = []
        missingProperties.forEach(prop => {
            errorMessage.push(`Missing property: ${prop}`)
        })
        return res.status(400).json({ errors: errorMessage })
    }     
    
    
    const replacementItem = {
        id:req.body.id,
        task : req.body.task
    }; 
    
    let Found = items.findIndex((item)=> item.id == replacementItem.id)
    if(Found < 0){ 
        return res.status(404).send({
            message:"Item not found"
        })
    } else if (replacementItem.id !== id){
        return res.status(400).send({
            message:"Id doesnt match"
        }) 
    } 
    else
    {
        items[search] = replacementItem;
        return res.status(200).json(replacementItem);
    }
  
    
})

router.delete('/:id', (req, res) =>{
    const id = parseInt(req.params.id);
    const searchIndex = items.findIndex(item => item.id === id);
    if(searchIndex > -1){
        items.splice(searchIndex, 1);
        res.status(200).send({
        "message": 'Item deleted successfully'
    });}
    else {
        res.status(404).send({message: 'Item id not found'});
    };

})

router.patch('/:id', (req, res) =>{
    let id = parseInt(req.params.id)
    let updateItem = items.findIndex(item => item.id === id);
    const replacementItem = {
        id:id,
        task : req.body.task || updateItem.task
    };

    const searchIndex = items.findIndex(item => item.id === id);
    items[searchIndex] = replacementItem;
    if (replacementItem){
        return res.status(200).json(replacementItem);    
    }    

})

export default router