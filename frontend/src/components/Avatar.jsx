export default function Avatar({user, size = 40}){
    const initial = user?.name?.charAt(0).toUpperCase() || '?';


    if(user?.photo_url) {
        return (
            <img 
            src={user.photo_url}
            alt={user.name}
            className="avatar"
            style={{ width: size, height: size }}
            />
        );
    }

    return (
        <div
        className="avatar avatar-fallback"
        style={{ width: size, height: size, fontSize: size * 0.45 }}>
            {initial}
        </div>
    );
} 