// src/components/navbar/NavActions.jsx
import { Button } from 'primereact/button';
import { Avatar } from 'primereact/avatar';

export default function NavActions() {
    return (
        <div className="flex align-items-center gap-3">
            <Button
                icon="pi pi-search"
                className="p-button-rounded p-button-text p-button-lg"
                tooltip="Search knowledge"
            />
            <Button
                icon="pi pi-bell"
                className="p-button-rounded p-button-text p-button-lg hidden sm:flex"
            />
            <Avatar
                image="https://i.pravatar.cc/150?u=knowledge"
                size="large"
                shape="circle"
                className="cursor-pointer"
            />
        </div>
    );
}