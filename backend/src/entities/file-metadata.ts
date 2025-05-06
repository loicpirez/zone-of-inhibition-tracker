import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class FileMetadata {
    @PrimaryGeneratedColumn('uuid') id!: string;

    @Column({ type: 'text' }) originalName!: string;

    @Column({ type: 'text' }) mimeType!: string;

    @Column('bigint') size!: string;
        
    @Column({ type: 'text' }) path!: string;

    @CreateDateColumn() createdAt!: Date;
}