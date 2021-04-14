const visitorDto = ({title, isCompleted,name,createdAt}) =>({
    title,
    isCompleted,
    name,
    createdAt 
})

const UserDto = ({_id, name, email}) => ({
    id: _id,
    name,
    email
    
})


module.exports = {
    UserDto,
    visitorDto
    }


