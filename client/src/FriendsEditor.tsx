import React, { Component} from "react";

type FriendsEditorProps = {
    user: string;
    friends: string[];
    users: string[];
    onFriendsChange: (newFriends: string[]) => void;
}

type FriendsEditorState = {
    users: string[];
}

export class FriendsEditor extends Component<FriendsEditorProps, FriendsEditorState> {
    constructor(props: FriendsEditorProps) {
        super(props);
    
        this.state = {
            users: this.props.users
        };
    }



    render = (): JSX.Element => {
        const userList = [];
        for (const user of this.props.users) {
            if (user !== this.props.user) {
                const isFriend = this.props.friends.includes(user);
                userList.push(
                    <li key={user}>
                        {user}
                        <button onClick={() => this.doFriendClick(user)}>
                            {isFriend ? "Unfriend" : "Friend"}
                        </button>
                    </li>
                );
            }
        }
        
        return (
            <div> Check those who are your friends:
                <ul>
                    {userList}
                </ul>
                
                
            </div>
        );
    };

    doFriendClick = (user: string): void => {
        const newFriends = this.props.friends;
        if (this.props.friends.includes(user)) {
            // Remove friend
            const index = newFriends.indexOf(user);
            newFriends.splice(index, 1);
        } else {
            // Add friend
            newFriends.push(user);
            
        }
        this.props.onFriendsChange(newFriends);
    };
}