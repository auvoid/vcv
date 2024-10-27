import { Test, TestingModule } from '@nestjs/testing';
import { Oid4vcController } from './oid4vc.controller';

describe('Oid4vcController', () => {
    let controller: Oid4vcController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [Oid4vcController],
        }).compile();

        controller = module.get<Oid4vcController>(Oid4vcController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
